var int = null;
var table = null;
//////////
ko.bindingHandlers.datalist = (function () {
    function getVal(rawItem, prop) {
        var item = ko.unwrap(rawItem);
        return item && prop ? ko.unwrap(item[prop]) : item;
    }

    function findItem(options, prop, ref) {
        return ko.utils.arrayFirst(options, function (item) {
            return ref === getVal(item, prop);
        });
    }
    return {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var setup = valueAccessor(),
                textProperty = ko.unwrap(setup.optionsText),
                valueProperty = ko.unwrap(setup.optionsValue),
                dataItems = ko.unwrap(setup.options),
                myValue = setup.value,
                koValue = allBindingsAccessor().value,
                datalist = document.createElement("DATALIST");

            // create an associated <datalist> element
            datalist.id = element.getAttribute("list");
            document.body.appendChild(datalist);

            // when the value is changed, write to the associated myValue observable
            function onNewValue(newVal) {
                var dataItems = ko.unwrap(setup.options),
                    selectedItem = findItem(dataItems, textProperty, newVal),
                    newValue = selectedItem ? getVal(selectedItem, valueProperty) : void 0;

                if (ko.isWriteableObservable(myValue)) {
                    myValue(newValue);
                }
            }

            // listen for value changes
            // - either via KO's value binding (preferred) or the change event
            if (ko.isSubscribable(koValue)) {
                koValue.subscribe(onNewValue);
            } else {
                ko.utils.registerEventHandler(element, "change", function () {
                    onNewValue(this.value);
                });
            }

            // init the element's value
            // - either via the myValue observable (preferred) or KO's value binding
            if (ko.isObservable(myValue) && myValue()) {
                element.value = getVal(findItem(dataItems, valueProperty, myValue()), textProperty);
            } else if (ko.isObservable(koValue) && koValue()) {
                onNewValue(koValue());
            }
        },
        update: function (element, valueAccessor) {
            var setup = valueAccessor(),
                datalist = element.list,
                dataItems = ko.unwrap(setup.options),
                textProperty = ko.unwrap(setup.optionsText);

            // rebuild list of options when an underlying observable changes
            datalist.innerHTML = "";
            ko.utils.arrayForEach(dataItems, function (item) {
                var option = document.createElement("OPTION");
                option.value = getVal(item, textProperty);
                datalist.appendChild(option);
            });
            ko.utils.triggerEvent(element, "change");
        }
    };
})();
//////////
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

var t = 0;
function request(ep, verb = "get", data) {
    var n = null;
    var r = {
        async: true,
        type: verb.toLowerCase(),
        url: 'https://sigesaf.ksdsolutions.net/api/v1/' + ep,
        contentType: 'application/json',
        accepts: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        beforeSend: function (xhr) {
            var aut = getCookie("_aut");
            if (aut === "") {
                location.href = "#login";
            }
            xhr.setRequestHeader("Authorization", "Basic " + aut);

            if (verb.toLowerCase() == 'get') {
                n = $.notify({
                    icon: 'ti-reload',
                    message: "Cargando datos..."
                }, {
                    type: 'info',
                    allow_dismiss: false,
                    delay: 0
                });
            } else {
                n = $.notify({
                    icon: 'ti-save-alt',
                    message: "Guardando datos..."
                }, {
                    type: 'info',
                    allow_dismiss: false,
                    delay: 0
                });
            }
        },
        error: function (xhr) {
            if (xhr.status == 0) {
                n.update({
                    icon: 'ti-signal',
                    message: "Se ha perdido la conexión con los servidores.",
                    type: 'danger'
                });
                setTimeout(() => {
                    n.close();
                }, 10000);
                /*
                var hasta = 33000;
                var x = setInterval(function() {
                    hasta = hasta -1000;
                    
                    if (hasta >= 3000) {
                        n.update({
                            icon: 'ti-signal',
                            message: "Se ha perdido la conexión con los servidores. Reintentando autom&aacute;ticamente en "+ (hasta -3000) / 1000 +" segundos. Intentos: "+ (t+1) +".",
                            type: 'danger'
                        });
                    } else if (hasta <= 0) {
                        clearInterval(x);
                        if (t < 3) {
                            t++;
                            request('dashboard');
                        }
                    }

                }, 1000);
                */
            } else if (xhr.status == 401) {
                var aut = getCookie("_aut");
                n.close();
                if (aut !== "") {
                    setCookie("_aut", "", 365);
                    location.reload();
                }
            } else if (xhr.status == 403) {
                n.update({
                    icon: 'ti-alert',
                    message: "No tiene permiso para realizar esa operación, contacte con un administrador.",
                    type: 'danger'
                });
                setTimeout(() => {
                    n.close();
                }, 10000);
            }
        }
    };

    var a = $.ajax(r);
    
    a.done(function () {
        if (a.status == 200) {
            n.update({
                icon: 'ti-check',
                message: "Cargado correctamente",
                type: 'success'
            });
        } else if (a.status == 201 || a.status == 204) {
            n.update({
                icon: 'ti-save-alt',
                message: "Guardado correctamente.",
                type: 'success'
            });
        }
        $("#loader").fadeOut();
        $("#body").fadeIn();
        setTimeout(() => {
            t = 0;
            n.close();
        }, 5000);
    });

    a.fail(function () {
        if (a.status == 500) {
            n.update({
                icon: 'ti-na',
                message: "Error al guardar",
                type: 'danger'
            });
            setTimeout(() => {
                n.close();
            }, 10000);
        }
    });

    hideddrivetip();
    return a;
}

////////
function modelo_dashboard() {
    var self = this;
    self.loading = ko.observable(true);
    self.c_tv = ko.observable();
    self.c_tv_r = ko.observable();
    self.t_c_tv = ko.observable();
    self.c_c = ko.observable();
    self.c_c_r = ko.observable();
    self.t_c_c = ko.observable();
    self.c_r = ko.observable();
    self.c_p_h = ko.observable();
    self.c_p_r = ko.observable();
    self.c_pc = ko.observable();
    self.c_pc_r = ko.observable();
    self.t_c_pc = ko.observable();
    self.c_c_l = ko.observable();
    self.c_c_l_r = ko.observable();
    self.t_c_c_l = ko.observable();
    self.c_s = ko.observable();
    self.c_s_r = ko.observable();
    self.t_c_s = ko.observable();

    self.cargar = function () {
        self.loading(true);
        request('dashboard').done(function (d) {
            self.c_tv(d.cantidadTV);
            self.c_tv_r(d.totalCantidadTV - d.cantidadTV);
            self.t_c_tv(d.totalCantidadTV);
            self.c_c(d.cantidadComputadoras);
            self.c_c_r(d.totalCantidadComputadoras - d.cantidadComputadoras);
            self.t_c_c(d.totalCantidadComputadoras);
            self.c_r(d.cantidadReportes);
            self.c_p_h(d.cantidadPrestamosHechos);
            self.c_p_r(d.cantidadPrestamosRecibidos);
            self.c_pc(d.cantidadPC);
            self.c_pc_r(d.totalCantidadPC - d.cantidadPC);
            self.t_c_pc(d.totalCantidadPC);
            self.c_c_l(d.cantidadClientesLigeros);
            self.c_c_l_r(d.totalCantidadClientesLigeros - d.cantidadClientesLigeros);
            self.t_c_c_l(d.totalCantidadClientesLigeros);
            self.c_s(d.cantidadServidores);
            self.c_s_r(d.totalCantidadServidores - d.cantidadServidores);
            self.t_c_s(d.totalCantidadServidores);
            self.loading(false);
        });
    }

    self.cargar();
    int = window.setInterval(() => {
        self.cargar();
    }, 180000);
}

function modelo_locales(l) {
    var self = this;
    self.loading = ko.observable(true);
    self.locales = ko.observableArray();
    self.locales.extend({ notify: 'always' });
    self.d = ko.observableArray();

    self.nuevo = function () {
        location.href = '#locales/nuevo';
    }

    self.guardar = function () {
        request('locales', 'post', {
            local: self.d.local || null,
            id_padre: self.d.id_padre || null
        }).done(function () {
            location.href = '#locales';
        });
        return false;
    }

    self.modificar = function () {
        request('locales/'+self.locales()[0].id(), 'put', {
            local: self.locales()[0].local() || null,
            id_padre: self.locales()[0].id_padre() || null
        }).done(function () {
            location.href = '#locales';
        });
        return false;
    }

    self.editar = function (l) {
        location.href = '#locales/' + l.id();
    }

    self.eliminar = function (l) {
        request('locales/' + l.id(), 'DELETE').done(function () {
            self.cargar();
        });
    }

    self.cargar = function (l = "") {
        self.loading(true);
        p = 'locales';
        if (l !== "") {
            p += '/' + l;
        }
        request(p).done(function (d) {
            self.locales.removeAll();
            if (d.length === undefined) {
                self.locales.push({
                    id: ko.observable(d.id),
                    local: ko.observable(d.local),
                    id_padre: ko.observable(d.id_padre),
                    padre: ko.observable("(-)")
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.locales.push({
                        id: ko.observable(d[i].id),
                        local: ko.observable(d[i].local),
                        id_padre: ko.observable(d[i].id_padre),
                        padre: ko.observable("(-)")
                    });
                }
            }

            if (self.locales().length > 2) {
                self.locales().forEach(l => {
                    self.locales().forEach(l_p => {
                        if (l.id_padre() == l_p.id()) {
                            l.padre(l_p.local());
                        }
                    });
                });
            }
            self.loading(false);
        });
    }

    self.cargar(l);
}

function modelo_usuarios(u) {
    var self = this;
    self.loading = ko.observable(true);
    self.usuarios = ko.observableArray();
    self.usuarios.extend({ notify: 'always' });
    self.d = ko.observableArray();

    self.nuevo = function () {
        location.href = '#usuarios/nuevo';
    }

    self.guardar = function () {
        request('usuarios', 'post', {
            usuario: self.d.usuario || null,
            nombre: self.d.nombre || null,
            clave: self.d.clave || null,
            admin: self.d.admin || false,
            id_local: self.d.id_local || null
        }).done(function () {
            location.href = '#usuarios';
        });
        return false;
    }

    self.modificar = function () {
        request('usuarios/'+self.usuarios()[0].id(), 'put', {
            usuario: self.usuarios()[0].usuario() || null,
            nombre: self.usuarios()[0].nombre() || null,
            admin: self.usuarios()[0].admin() || false,
            id_local: self.usuarios()[0].id_local() || null
        }).done(function () {
            location.href = '#usuarios';
        });
        return false;
    }

    self.editar = function (u) {
        location.href = '#usuarios/' + u.usuario();
    }

    self.eliminar = function (u) {
        request('usuarios/' + u.usuario(), 'DELETE').done(function () {
            self.cargar();
        });
    }

    self.cargar = function (u = "") {
        self.loading(true);
        p = 'usuarios';
        if (u !== "") {
            p += '/' + u;
        }
        request(p).done(function (d) {
            self.usuarios.removeAll();
            if (d.length === undefined) {
                self.usuarios.push({
                    id: ko.observable(d.id),
                    usuario: ko.observable(d.usuario),
                    nombre: ko.observable(d.nombre),
                    admin: ko.observable(d.admin),
                    id_local: ko.observable(d.id_local),
                    local: ko.observable(d.local)
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.usuarios.push({
                        id: ko.observable(d[i].id),
                        usuario: ko.observable(d[i].usuario),
                        nombre: ko.observable(d[i].nombre),
                        admin: ko.observable(d[i].admin),
                        id_local: ko.observable(d[i].id_local),
                        local: ko.observable(d[i].local)
                    });
                }
            }
            self.loading(false);
        });
    }
    self.cargar(u);
}

function modelo_equipos(e) {
    var self = this;
    self.loading = ko.observable(true);
    self.equipos = ko.observableArray();
    self.equipos.extend({ notify: 'always' });
    self.d = ko.observableArray();
    self.destino = ko.observable(null);

    self.nuevo = function () {
        location.href = '#equipos/nuevo';
    }

    self.guardar = function () {
        request('equipos', 'post', {
            id_estado: self.d.id_estado || null,
            id_local: self.d.id_local || null,
            id_marca: self.d.id_marca || null,
            id_tipo: self.d.id_tipo || null,
            no_inv: self.d.no_inv || null,
            observaciones: self.d.observaciones || null,
            sello: self.d.sello || null
        }).done(function () {
            location.href = '#equipos';
        });
        return false;
    }

    self.reportar = function () {
        request('reportes', 'post', {
            id_equipo: self.equipos()[0].id() || null,
            id_estado: self.d.id_estado || null,
            problema: self.d.problema || null
        }).done(function () {
            location.href = '#equipos';
        });
        return false;
    }

    self.prestar = function () {
        request('prestamos', 'post', {
            fecha_fin: self.d.fecha_fin || null,
            motivo: self.d.motivo || null,
            recibe: self.d.recibe || null,
            local_req: (isNaN(self.destino()) ? self.d.local_req : null),
            id_equipo: self.equipos()[0].id() || null,
            id_local_dest: (isNaN(self.destino()) ? 0 : self.destino())
        }).done(function () {
            location.href = '#equipos';
        });
        return false;
    }

    self.modificar = function () {
        request('equipos/'+self.equipos()[0].id(), 'put', {
            id_estado: self.equipos()[0].id_estado() || null,
            id_local: self.equipos()[0].id_local() || null,
            id_marca: self.equipos()[0].id_marca() || null,
            id_tipo: self.equipos()[0].id_tipo() || null,
            no_inv: self.equipos()[0].no_inv() || null,
            observaciones: self.equipos()[0].observaciones() || null,
            sello: self.equipos()[0].sello() || null
        }).done(function () {
            location.href = '#equipos';
        });
        return false;
    }

    self.editar = function (e) {
        location.href = '#equipos/' + e.id();
    }

    self.eliminar = function (e) {
        request('equipos/' + e.id(), 'DELETE').done(function () {
            self.cargar();
        });
    }

    self.reporte = function (e) {
        location.href = '#equipos/' + e.id() + '/reportar';
    }

    self.prestamo = function (e) {
        location.href = '#equipos/' + e.id() + '/prestar';
    }

    self.cargar = function (e = "") {
        self.loading(true);
        p = 'equipos';
        if (e !== "") {
            p += '/' + e;
        }
        request(p).done(function (d) {
            self.equipos.removeAll();
            if (d.length === undefined) {
                self.equipos.push({
                    id: ko.observable(d.id),
                    id_estado: ko.observable(d.id_estado),
                    id_local: ko.observable(d.id_local),
                    id_marca: ko.observable(d.id_marca),
                    id_tipo: ko.observable(d.id_tipo),
                    no_inv: ko.observable(d.no_inv),
                    observaciones: ko.observable(d.observaciones),
                    sello: ko.observable(d.sello)
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.equipos.push({
                        id: ko.observable(d[i].id),
                        id_estado: ko.observable(d[i].id_estado),
                        estado: ko.observable(d[i].estado),
                        id_local: ko.observable(d[i].id_local),
                        local: ko.observable(d[i].local),
                        id_marca: ko.observable(d[i].id_marca),
                        marca: ko.observable(d[i].marca),
                        id_tipo: ko.observable(d[i].id_tipo),
                        tipo: ko.observable(d[i].tipo),
                        no_inv: ko.observable(d[i].no_inv),
                        observaciones: ko.observable((d[i].observaciones == null) ? '(-)' : d[i].observaciones),
                        sello: ko.observable((d[i].sello == null) ? '(-)' : d[i].sello)
                    });
                }
            }
            self.loading(false);
        });
    }

    self.cargar(e);
}

function modelo_reportes(r) {
    var self = this;
    self.loading = ko.observable(true);
    self.reportes = ko.observableArray();
    self.d = ko.observableArray();

    self.modificar = function () {
        request('reportes/'+self.reportes()[0].id(), 'put', {
            problema: self.reportes()[0].problema() || null,
            id_estado: self.reportes()[0].id_estado()
        }).done(function () {
            location.href = '#reportes';
        });
        return false;
    }

    self.editar = function (r) {
        location.href = '#reportes/' + r.id();
    }

    self.eliminar = function (r) {
        request('reportes/' + r.id(), 'DELETE').done(function () {
            self.cargar();
        });
    }

    self.cargar = function (r = "") {
        self.loading(true);
        p = 'reportes';
        if (r !== "") {
            p += '/' + r;
        }
        request(p).done(function (d) {
            self.reportes.removeAll();
            if (d.length === undefined) {
                self.reportes.push({
                    id: ko.observable(d.id),
                    fecha: ko.observable(new Date(d.fecha['date']).toLocaleDateString()),
                    problema: ko.observable(d.problema),
                    equipo: ko.observable(d.equipo),
                    id_usuario: ko.observable(d.id_usuario),
                    id_equipo: ko.observable(d.id_equipo),
                    id_estado: ko.observable(d.id_estado)
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.reportes.push({
                        id: ko.observable(d[i].id),
                        fecha: ko.observable(new Date(d[i].fecha['date']).toLocaleDateString()),
                        problema: ko.observable(d[i].problema),
                        id_usuario: ko.observable(d[i].id_usuario),
                        id_equipo: ko.observable(d[i].id_equipo),
                        id_estado: ko.observable(d[i].id_estado),
                        usuario: ko.observable(d[i].usuario),
                        equipo: ko.observable(d[i].equipo),
                        local: ko.observable(d[i].local),
                        marca: ko.observable(d[i].marca),
                        tipo: ko.observable(d[i].tipo),
                        estado: ko.observable(d[i].estado)
                    });
                }
            }
            self.loading(false);
        });
    }

    self.cargar(r);
}

function modelo_prestamos(p) {
    var self = this;
    self.loading = ko.observable(true);
    self.prestamos = ko.observableArray();
    self.d = ko.observableArray();

    self.modificar = function () {
        request('prestamos/'+self.prestamos()[0].id(), 'put', {
            problema: self.prestamos()[0].problema() || null,
            id_estado: self.prestamos()[0].id_estado()
        }).done(function () {
            location.href = '#prestamos';
        });
        return false;
    }

    self.editar = function (p) {
        location.href = '#prestamos/' + p.id();
    }

    self.eliminar = function (p) {
        request('prestamos/' + p.id(), 'DELETE').done(function () {
            self.cargar();
        });
    }

    self.cargar = function (p = "") {
        self.loading(true);
        ep = 'prestamos';
        if (p !== "") {
            ep += '/' + p;
        }
        request(ep).done(function (d) {
            self.prestamos.removeAll();
            if (d.length === undefined) {
                self.prestamos.push({
                    id: ko.observable(d.id),
                    fecha: ko.observable(new Date(d.fecha['date']).toLocaleDateString()),
                    fecha_fin: ko.observable(new Date(d.fecha_fin['date']).toLocaleDateString()),
                    motivo: ko.observable(d.motivo),
                    recibe: ko.observable(d.recibe),
                    local_req: ko.observable(d.local_req),
                    id_equipo: ko.observable(d.id_equipo),
                    id_local_dest: ko.observable(d.id_local_dest),
                    id_estado: ko.observable(d.id_estado),
                    id_usuario_req: ko.observable(d.id_usuario_req),
                    id_usuario_aut: ko.observable(d.id_usuario_aut)
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.prestamos.push({
                        id: ko.observable(d[i].id),
                        fecha: ko.observable(new Date(d[i].fecha['date']).toLocaleDateString()),
                        fecha_fin: ko.observable(new Date(d[i].fecha_fin['date']).toLocaleDateString()),
                        motivo: ko.observable(d[i].motivo),
                        recibe: ko.observable(d[i].recibe),
                        local_req: ko.observable(d[i].local_req),
                        id_equipo: ko.observable(d[i].id_equipo),
                        id_local_dest: ko.observable(d[i].id_local_dest),
                        id_estado: ko.observable(d[i].id_estado),
                        id_usuario_req: ko.observable(d[i].id_usuario_req),
                        id_usuario_aut: ko.observable(d[i].id_usuario_aut),
                        usuario_req: ko.observable(d[i].usuario_req),
                        equipo: ko.observable(d[i].equipo),
                        local: ko.observable(d[i].local),
                        marca: ko.observable(d[i].marca),
                        tipo: ko.observable(d[i].tipo),
                        estado: ko.observable(d[i].estado),
                        local_destino: ko.observable(d[i].local_destino),
                        autoriza: ko.observable(d[i].autoriza)
                    });
                }
            }
            self.loading(false);
        });
    }

    self.cargar(p);
}

function modelo_estados_reportes(e_r) {
    var self = this;
    self.loading = ko.observable(true);
    self.estados = ko.observableArray();
    self.d = ko.observableArray();

    self.nuevo = function () {
        location.href = '#estadosReportes/nuevo';
    }

    self.guardar = function () {
        request('estadosReportes', 'post', {
            estado: self.d.estado || null,
            descripcion: self.d.descripcion || null
        }).done(function () {
            location.href = '#estadosReportes';
        });
        return false;
    }

    self.modificar = function () {
        request('estadosReportes/'+self.estados()[0].id(), 'put', {
            estado: self.estados()[0].estado() || null,
            descripcion: self.estados()[0].descripcion() || null
        }).done(function () {
            location.href = '#estadosReportes';
        });
        return false;
    }

    self.editar = function (e) {
        location.href = '#estadosReportes/' + e.id();
    }

    self.eliminar = function (e) {
        request('estadosReportes/' + e.id(), 'DELETE').done(function () {
            self.cargar();
        });
    }

    self.cargar = function (e = "") {
        self.loading(true);
        p = 'estadosReportes';
        if (e !== "") {
            p += '/' + e;
        }
        request(p).done(function (d) {
            self.estados.removeAll();
            if (d.length === undefined) {
                self.estados.push({
                    id: ko.observable(d.id),
                    estado: ko.observable(d.estado),
                    descripcion: ko.observable(d.descripcion)
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.estados.push({
                        id: ko.observable(d[i].id),
                        estado: ko.observable(d[i].estado),
                        descripcion: ko.observable(d[i].descripcion)
                    });
                }
            }
            self.loading(false);
        });
    }

    self.cargar(e_r);
}

function modelo_estados_equipos(e_e) {
    var self = this;
    self.loading = ko.observable(true);
    self.estados = ko.observableArray();
    self.d = ko.observableArray();

    self.nuevo = function () {
        location.href = '#estadosEquipos/nuevo';
    }

    self.guardar = function () {
        request('estadosEquipos', 'post', {
            estado: self.d.estado || null,
            descripcion: self.d.descripcion || null
        }).done(function () {
            location.href = '#estadosEquipos';
        });
        return false;
    }

    self.modificar = function () {
        request('estadosEquipos/'+self.estados()[0].id(), 'put', {
            estado: self.estados()[0].estado() || null,
            descripcion: self.estados()[0].descripcion() || null
        }).done(function () {
            location.href = '#estadosEquipos';
        });
        return false;
    }

    self.editar = function (e) {
        location.href = '#estadosEquipos/' + e.id();
    }

    self.eliminar = function (e) {
        request('estadosEquipos/' + e.id(), 'DELETE').done(function () {
            self.cargar();
        });
    }

    self.cargar = function (e = "") {
        self.loading(true);
        p = 'estadosEquipos';
        if (e !== "") {
            p += '/' + e;
        }
        request(p).done(function (d) {
            self.estados.removeAll();
            if (d.length === undefined) {
                self.estados.push({
                    id: ko.observable(d.id),
                    estado: ko.observable(d.estado),
                    descripcion: ko.observable(d.descripcion)
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.estados.push({
                        id: ko.observable(d[i].id),
                        estado: ko.observable(d[i].estado),
                        descripcion: ko.observable(d[i].descripcion)
                    });
                }
            }
            self.loading(false);
        });
    }

    self.cargar(e_e);
}

function modelo_estados_prestamos(e_p) {
    var self = this;
    self.loading = ko.observable(true);
    self.estados = ko.observableArray();
    self.d = ko.observableArray();

    self.nuevo = function () {
        location.href = '#estadosPrestamos/nuevo';
    }

    self.guardar = function () {
        request('estadosPrestamos', 'post', {
            estado: self.d.estado || null,
            descripcion: self.d.descripcion || null
        }).done(function () {
            location.href = '#estadosPrestamos';
        });
        return false;
    }

    self.modificar = function () {
        request('estadosPrestamos/'+self.estados()[0].id(), 'put', {
            estado: self.estados()[0].estado() || null,
            descripcion: self.estados()[0].descripcion() || null
        }).done(function () {
            location.href = '#estadosPrestamos';
        });
        return false;
    }

    self.editar = function (e) {
        location.href = '#estadosPrestamos/' + e.id();
    }

    self.eliminar = function (e) {
        request('estadosPrestamos/' + e.id(), 'DELETE').done(function () {
            self.cargar();
        });
    }

    self.cargar = function (e = "") {
        self.loading(true);
        p = 'estadosPrestamos';
        if (e !== "") {
            p += '/' + e;
        }
        request(p).done(function (d) {
            self.estados.removeAll();
            if (d.length === undefined) {
                self.estados.push({
                    id: ko.observable(d.id),
                    estado: ko.observable(d.estado),
                    descripcion: ko.observable(d.descripcion)
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.estados.push({
                        id: ko.observable(d[i].id),
                        estado: ko.observable(d[i].estado),
                        descripcion: ko.observable(d[i].descripcion)
                    });
                }
            }
            self.loading(false);
        });
    }

    self.cargar(e_p);
}

function modelo_tipos_equipos(t_e) {
    var self = this;
    self.loading = ko.observable(true);
    self.tipos = ko.observableArray();
    self.d = ko.observableArray();

    self.nuevo = function () {
        location.href = '#tiposEquipos/nuevo';
    }

    self.guardar = function () {
        request('tiposEquipos', 'post', {
            tipo: self.d.tipo || null,
            descripcion: self.d.descripcion || null
        }).done(function () {
            location.href = '#tiposEquipos';
        });
        return false;
    }

    self.modificar = function () {
        request('tiposEquipos/'+self.tipos()[0].id(), 'put', {
            tipo: self.tipos()[0].tipo() || null,
            descripcion: self.tipo()[0].descripcion() || null
        }).done(function () {
            location.href = '#tiposEquipos';
        });
        return false;
    }

    self.editar = function (e) {
        location.href = '#tiposEquipos/' + e.id();
    }

    self.eliminar = function (e) {
        request('tiposEquipos/' + e.id(), 'DELETE').done(function () {
            self.cargar();
        });
    }

    self.cargar = function (e = "") {
        self.loading(true);
        p = 'tiposEquipos';
        if (e !== "") {
            p += '/' + e;
        }
        request(p).done(function (d) {
            self.tipos.removeAll();
            if (d.length === undefined) {
                self.tipos.push({
                    id: ko.observable(d.id),
                    tipo: ko.observable(d.tipo),
                    descripcion: ko.observable(d.descripcion)
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.tipos.push({
                        id: ko.observable(d[i].id),
                        tipo: ko.observable(d[i].tipo),
                        descripcion: ko.observable(d[i].descripcion)
                    });
                }
            }
            self.loading(false);
        });
    }

    self.cargar(t_e);
}

function modelo_marcas(m) {
    var self = this;
    self.loading = ko.observable(true);
    self.marcas = ko.observableArray();
    self.d = ko.observableArray();

    self.nuevo = function () {
        location.href = '#marcas/nuevo';
    }

    self.guardar = function () {
        request('marcas', 'post', {
            marca: self.d.marca || null
        }).done(function () {
            location.href = '#marcas';
        });
        return false;
    }

    self.modificar = function () {
        request('marcas/'+self.marcas()[0].id(), 'put', {
            marca: self.marcas()[0].marca() || null
        }).done(function () {
            location.href = '#marcas';
        });
        return false;
    }

    self.editar = function (m) {
        location.href = '#marcas/' + m.id();
    }

    self.eliminar = function (m) {
        request('marcas/' + m.id(), 'DELETE').done(function () {
            self.cargar();
        });
    }

    self.cargar = function (m = "") {
        self.loading(true);
        p = 'marcas';
        if (m !== "") {
            p += '/' + m;
        }
        request(p).done(function (d) {
            self.marcas.removeAll();
            if (d.length === undefined) {
                self.marcas.push({
                    id: ko.observable(d.id),
                    marca: ko.observable(d.marca)
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.marcas.push({
                        id: ko.observable(d[i].id),
                        marca: ko.observable(d[i].marca)
                    });
                }
            }
            self.loading(false);
        });
    }

    self.cargar(m);
}
////////
var loading = ko.observable(true);

var urlMapping = {
    home: { match: /^$/, page: dashboard },
    usuarios: { match: /^usuarios$/, page: usuarios },
    usuarios_p: { match: /^usuarios\/(.+)$/, page: usuarios },
    locales: { match: /^locales$/, page: locales },
    locales_p: { match: /^locales\/(.+)$/, page: locales },
    equipos: { match: /^equipos$/, page: equipos },
    equipos_p: { match: /^equipos\/(.+)$/, page: equipos },
    reportes: { match: /^reportes$/, page: reportes },
    reportes_p: { match: /^reportes\/(.+)$/, page: reportes },
    prestamos: { match: /^prestamos$/, page: prestamos },
    prestamos_p: { match: /^prestamos\/(.+)$/, page: prestamos },
    login: { match: /^login$/, page: login },
    logoff: { match: /^logoff$/, page: logoff },
    config: { match: /^config$/, page: config },
    fail: { match: /^fail$/, page: failPage }
}

function dashboard() {
    window.clearInterval(int);
    $('.nav-dashboard').addClass('active');
    $('.nav-usuarios').removeClass('active');
    $('.nav-locales').removeClass('active');
    $('.nav-equipos').removeClass('active');
    $('.nav-reportes').removeClass('active');
    $('.nav-prestamos').removeClass('active');

    return new Router.Page('Dashboard', 'home-template', { d: new modelo_dashboard });
}

function usuarios(param = "") {
    window.clearInterval(int);
    $('.nav-usuarios').addClass('active');
    $('.nav-dashboard').removeClass('active');
    $('.nav-locales').removeClass('active');
    $('.nav-equipos').removeClass('active');
    $('.nav-reportes').removeClass('active');
    $('.nav-prestamos').removeClass('active');

    if (param === "nuevo") {
        return new Router.Page('Usuarios', 'pg-nuevo-usuario', { u: new modelo_usuarios(), l: new modelo_locales() });
    } else if (param !== "") {
        loading(true);
        var u = new modelo_usuarios(param);
        var l = new modelo_locales();

        ko.when(function () {
            return l.loading() == false && u.loading() == false;
        }, function (result) {
            u.usuarios(u.usuarios());
            loading(false);
        });
        return new Router.Page('Usuarios', 'pg-editar-usuario', { loading: loading, u: u, l: l });
    } else {
        var u = new modelo_usuarios();
        int = window.setInterval(() => {
            u.cargar();
        }, 180000);

        return new Router.Page('Usuarios', 'pg-usuarios', { u: u });
    }
}

function locales(param = "") {
    window.clearInterval(int);
    $('.nav-locales').addClass('active');
    $('.nav-dashboard').removeClass('active');
    $('.nav-usuarios').removeClass('active');
    $('.nav-equipos').removeClass('active');
    $('.nav-reportes').removeClass('active');
    $('.nav-prestamos').removeClass('active');

    var l = new modelo_locales();

    if (param === "nuevo") {
        return new Router.Page('Locales', 'pg-nuevo-local', { l: l });
    } else if (param !== "" && !isNaN(param)) {
        loading(true);
        var l2 = new modelo_locales(param);

        ko.when(function () {
            return l.loading() == false && l2.loading() == false;
        }, function (result) {
            l2.locales(l2.locales());
            loading(false);
        });
        return new Router.Page('Locales', 'pg-editar-local', { loading: loading, l: l, l2: l2 });
    } else {
        int = window.setInterval(() => {
            l.cargar();
        }, 180000);
        return new Router.Page('Locales', 'pg-locales', { l: l });
    }
}

function equipos(param = "") {
    window.clearInterval(int);
    $('.nav-locales').removeClass('active');
    $('.nav-dashboard').removeClass('active');
    $('.nav-usuarios').removeClass('active');
    $('.nav-equipos').addClass('active');
    $('.nav-reportes').removeClass('active');
    $('.nav-prestamos').removeClass('active');

    if (param === "nuevo") {
        return new Router.Page('Equipos', 'pg-nuevo-equipo', { e: new modelo_equipos(), l: new modelo_locales(), e_e : new modelo_estados_equipos(), t_e: new modelo_tipos_equipos(), m: new modelo_marcas()});
    } else if (param !== "") {
        loading(true);
        var e = new modelo_equipos(param);
        if (param.toLowerCase().endsWith("/reportar")) {
            param = param.replace("/reportar", "").trim();
            var e_r = new modelo_estados_reportes();
            ko.when(function () {
                return e_r.loading() == false && e.loading() == false;
            }, function (result) {
                e.equipos(e.equipos());
                loading(false);
            });
            return new Router.Page('Equipos', 'pg-reportar-equipo', { loading: loading, e: e, e_r: e_r });
        } else if (param.toLowerCase().endsWith("/prestar")) {
            param = param.replace("/prestar", "").trim();
            loading(true);
            var l = new modelo_locales();
            ko.when(function () {
                return l.loading() == false && e.loading() == false;
            }, function (result) {
                e.equipos(e.equipos());
                loading(false);
            });
            return new Router.Page('Equipos', 'pg-prestar-equipo', { loading: loading, e: e, l: l });
        }

        var l = new modelo_locales();
        var e_e = new modelo_estados_equipos();
        var t_e = new modelo_tipos_equipos();
        var m = new modelo_marcas();

        ko.when(function () {
            return (l.loading() == false && e_e.loading() == false && t_e.loading() == false && m.loading() == false) && e.loading() == false;
        }, function (result) {
            e.equipos(e.equipos());
            loading(false);
        });
        return new Router.Page('Equipos', 'pg-editar-equipo', { loading: loading, e: e, l: l, e_e : e_e, t_e: t_e, m: m});
    } else {
        var e = new modelo_equipos();
        int = window.setInterval(() => {
            e.cargar();
        }, 180000);
        return new Router.Page('Equipos', 'pg-equipos', { e: e });
    }
}

function reportes(param = "") {
    window.clearInterval(int);
    $('.nav-usuarios').removeClass('active');
    $('.nav-dashboard').removeClass('active');
    $('.nav-locales').removeClass('active');
    $('.nav-equipos').removeClass('active');
    $('.nav-reportes').addClass('active');
    $('.nav-prestamos').removeClass('active');

    if (param !== "") {
        loading(true);
        var r = new modelo_reportes(param);
        var e_r = new modelo_estados_reportes();

        ko.when(function () {
            return e_r.loading() == false && r.loading() == false;
        }, function (result) {
            r.reportes(r.reportes());
            loading(false);
        });
        return new Router.Page('Reportes', 'pg-editar-reporte', { loading: loading, r: r, e_r: e_r });
    } else {
        var r = new modelo_reportes();
        int = window.setInterval(() => {
            r.cargar();
        }, 180000);

        return new Router.Page('Reportes', 'pg-reportes', { r: r });
    }
}

function prestamos(param = "") {
    window.clearInterval(int);
    $('.nav-usuarios').removeClass('active');
    $('.nav-dashboard').removeClass('active');
    $('.nav-locales').removeClass('active');
    $('.nav-equipos').removeClass('active');
    $('.nav-reportes').removeClass('active');
    $('.nav-prestamos').addClass('active');

    if (param !== "") {
        loading(true);
        var p = new modelo_prestamos(param);
        var e_r = new modelo_estados_reportes();

        ko.when(function () {
            return e_r.loading() == false && p.loading() == false;
        }, function (result) {
            p.prestamos(p.prestamos());
            loading(false);
        });
        return new Router.Page('Préstamos', 'pg-editar-prestamo', { loading: loading, p: p, e_r: e_r });
    } else {
        var p = new modelo_prestamos();
        int = window.setInterval(() => {
            p.cargar();
        }, 180000);

        return new Router.Page('Préstamos', 'pg-prestamos', { p: p });
    }
}

function login() {
    var aut = getCookie("_aut");
    if (aut !== "") {
        location.href = "/";
    }
    $('body').empty();
    $('body').append("<div class=\"content container\"><div class=\"row\"><div class=\"col-lg-12\"><div id=\"login-form\" class=\"center-block d-block mx-auto col-lg-4 col-md-5\"><div class=\"card\"><div class=\"header\"><h4 class=\"title\">Autenticación</h4></div><div class=\"content\"><form id=\"frm-login\"><div class=\"row\"><div class=\"form-group\"><label>Usuario</label><input id=\"usr\" type=\"text\" class=\"form-control border-input\" placeholder=\"Usuario\" autocomplete=\"username\"></div></div><div class=\"row\"><div class=\"form-group\"><label>Clave</label><input id=\"pass\" type=\"password\" class=\"form-control border-input\" placeholder=\"Clave\" autocomplete=\"current-password\"></div></div><div class=\"text-center\"><button type=\"submit\" class=\"btn btn-info btn-fill btn-wd\">Entrar</button></div><div class=\"clearfix\"></div></form></div></div></div></div></div></div>");
    $("#frm-login").submit(function () {
        var u = $('#usr').val();
        var p = $('#pass').val();

        if (u !== "" || p !== "") {
            aut = btoa(u + ":" + p);
            setCookie("_aut", aut, 365);
            request('dashboard').done(function () {
                location.href = "/";
            });
        }
        return false;
    });
    return new Router.Page('Login', null, {});
}

function logoff() {
    setCookie("_aut", "", 365);
    location.href = "/";
    return new Router.Page('Logoff', null, {});
}

function config() {
    return new Router.Page('Configuración', 'pg-config', {});
}

function failPage() {
    return new Router.Page('Will it work?', 'simple-template', { error: ko.observable('Deliberate error!') });
}

var topLevelModel = { router: new Router(urlMapping) };
window.topLevelModel = topLevelModel

ko.applyBindings(topLevelModel, $('html').get(0));

/***********************************************
* Cool DHTML tooltip script- (c) Dynamic Drive DHTML code library (www.dynamicdrive.com)
* Please keep this notice intact
* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
***********************************************/

var offsetxpoint=0 //Customize x offset of tooltip
var offsetypoint=15 //Customize y offset of tooltip
var ie=document.all
var ns6=document.getElementById && !document.all
var enabletip=false
if (ie||ns6)
var tipobj=document.all? document.all["dhtmltooltip"] : document.getElementById? document.getElementById("dhtmltooltip") : ""
try {
    document.body.appendChild(tipobj);
} catch (error) {}

function ietruebody(){
return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body
}

function ddrivetip(thetext, thecolor, thewidth){
if (ns6||ie){
if (typeof thewidth!="undefined") tipobj.style.width=thewidth+"px"
if (typeof thecolor!="undefined" && thecolor!="") tipobj.style.backgroundColor=thecolor
tipobj.innerHTML=thetext
enabletip=true
return false
}
}

function positiontip(e){
if (enabletip){
var curX=(ns6)?e.pageX : event.clientX+ietruebody().scrollLeft;
var curY=(ns6)?e.pageY : event.clientY+ietruebody().scrollTop;
//Find out how close the mouse is to the corner of the window
var rightedge=ie&&!window.opera? ietruebody().clientWidth-event.clientX-offsetxpoint : window.innerWidth-e.clientX-offsetxpoint-20
var bottomedge=ie&&!window.opera? ietruebody().clientHeight-event.clientY-offsetypoint : window.innerHeight-e.clientY-offsetypoint-20

var leftedge=(offsetxpoint<0)? offsetxpoint*(-1) : -1000

//if the horizontal distance isn't enough to accomodate the width of the context menu
if (rightedge<tipobj.offsetWidth)
//move the horizontal position of the menu to the left by it's width
tipobj.style.left=ie? ietruebody().scrollLeft+event.clientX-tipobj.offsetWidth+"px" : window.pageXOffset+e.clientX-tipobj.offsetWidth+"px"
else if (curX<leftedge)
tipobj.style.left="5px"
else
//position the horizontal position of the menu where the mouse is positioned
tipobj.style.left=curX+offsetxpoint+"px"

//same concept with the vertical position
if (bottomedge<tipobj.offsetHeight)
tipobj.style.top=ie? ietruebody().scrollTop+event.clientY-tipobj.offsetHeight-offsetypoint+"px" : window.pageYOffset+e.clientY-tipobj.offsetHeight-offsetypoint+"px"
else
tipobj.style.top=curY+offsetypoint+"px"
tipobj.style.visibility="visible"
}
}

function hideddrivetip(){
if (ns6||ie){
enabletip=false
tipobj.style.visibility="hidden"
tipobj.style.left="-1000px"
tipobj.style.backgroundColor=''
tipobj.style.width=''
}
}

document.onmousemove=positiontip
