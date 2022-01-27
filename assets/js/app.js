var int = null;
var table = null;

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

function request(ep, verb, data) {
    var r = {
        async: true,
        type: verb,
        url: 'https://sigesaf.ksdsolutions.net/api/' + ep,
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
        },
        error: function (xhr) {
            if (xhr.status == 0) {
                $.notify({
                    icon: 'ti-signal',
                    message: "Se ha perdido la conexión con los servidores."
    
                },{
                    type: 'danger',
                    timer: 4000
                });
            } else if (xhr.status == 401) {
                var aut = getCookie("_aut");
                if (aut !== "") {
                    setCookie("_aut", "", 365);
                    location.reload();
                }
            }
        }
    };

    var a = $.ajax(r);
    
    a.done(function () {
        if (a.status == 201) {
            $.notify({
                icon: 'ti-save',
                message: "Agregado correctamente a la base de datos."

            },{
                type: 'success',
                timer: 4000
            });
        } else if (a.status == 202) {
            $.notify({
                icon: 'ti-save-alt',
                message: "Modificado correctamente."

            },{
                type: 'success',
                timer: 4000
            });
        } else if (a.status == 204) {
            $.notify({
                icon: 'ti-na',
                message: "Eliminado correctamente."

            },{
                type: 'success',
                timer: 4000
            });
        }
        $("#loader").fadeOut();
        $("#body").fadeIn();
    });

    hideddrivetip();
    return a;
}

////////
function modelo_dashboard() {
    var self = this;
    self.c_u = ko.observable();
    self.c_c = ko.observable();
    self.c_r = ko.observable();
    self.c_p_h = ko.observable();
    self.c_p_r = ko.observable();
    self.c_pc = ko.observable();

    self.cargar = function () {
        request('dashboard').done(function (d) {
            self.c_u(d.cantidadUsuarios),
            self.c_c(d.cantidadComputadoras),
            self.c_r(d.cantidadReportes),
            self.c_p_h(d.cantidadPrestamosHechos),
            self.c_p_r(d.cantidadPrestamosRecibidos)
            self.c_pc(d.cantidadPC)
        });
    }

    self.cargar();
    int = window.setInterval(() => {
        self.cargar();
    }, 30000);
}

function modelo_locales(l) {
    var self = this;
    self.locales = ko.observableArray();
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
        }).fail(function () {
            alert('No se pudo agregar el local: '+self.d.local+'.');
        });
        return false;
    }

    self.modificar = function () {
        request('locales/'+self.locales()[0].id(), 'put', {
            local: self.locales()[0].local() || null,
            id_padre: self.locales()[0].id_padre() || null
        }).done(function () {
            location.href = '#locales';
        }).fail(function () {
            alert('No se pudo modificar el local: '+self.locales()[0].local()+'.');
        });
        return false;
    }

    self.editar = function (l) {
        location.href = '#locales/' + l.id();
    }

    self.eliminar = function (l) {
        request('locales/' + l.id(), 'DELETE').done(function () {
            self.cargar();
        }).fail(function () {
            alert('No se pudo eliminar el local: ' + l.local() + '.');
        });
    }

    self.cargar = function (l = "") {
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
        });
    }

    self.cargar(l);
}

function modelo_usuarios(u) {
    var self = this;
    self.usuarios = ko.observableArray();
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
        }).fail(function () {
            alert('No se pudo agregar el usuario: '+self.d.usuario+'.');
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
        }).fail(function () {
            alert('No se pudo modificar el usuario: '+self.usuarios()[0].usuario()+'.');
        });
        return false;
    }

    self.editar = function (u) {
        location.href = '#usuarios/' + u.usuario();
    }

    self.eliminar = function (u) {
        request('usuarios/' + u.usuario(), 'DELETE').done(function () {
            self.cargar();
        }).fail(function () {
            alert('No se pudo eliminar el usuario: ' + u.usuario() + '.');
        });
    }

    self.cargar = function (u = "") {
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
        });
    }
    self.cargar(u);
}

function modelo_equipos(e) {
    var self = this;
    self.equipos = ko.observableArray();
    self.d = ko.observableArray();

    self.nuevo = function () {
        location.href = '#equipos/nuevo';
    }

    self.guardar = function () {
        request('equipos', 'post', {
            equipo: self.d.equipo || null,
            local: self.d.local || null
        }).done(function () {
            location.href = '#equipos';
        }).fail(function () {
            alert('No se pudo agregar el equipo: '+self.d.equipo+'.');
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
        }).fail(function () {
            alert('No se pudo reportar el equipo: '+self.equipos()[0].no_inv()+'.');
        });
        return false;
    }

    self.modificar = function () {
        request('equipos/'+self.equipos()[0].id(), 'put', {
            equipo: self.equipos()[0].equipo() || null,
            local: self.equipos()[0].local() || null
        }).done(function () {
            location.href = '#equipos';
        }).fail(function () {
            alert('No se pudo modificar el equipo: '+self.equipos()[0].equipo()+'.');
        });
        return false;
    }

    self.editar = function (e) {
        location.href = '#equipos/' + e.id();
    }

    self.eliminar = function (e) {
        request('equipos/' + e.id(), 'DELETE').done(function () {
            self.cargar();
        }).fail(function () {
            alert('No se pudo eliminar el equipo: ' + e.equipo() + '.');
        });
    }

    self.reporte = function (e) {
        location.href = '#equipos/' + e.id() + '/reportar';
    }

    self.cargar = function (e = "") {
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
        });
    }

    self.cargar(e);
}

function modelo_estados_reportes(e_r) {
    var self = this;
    self.estados = ko.observableArray();
    self.d = ko.observableArray();

    self.nuevo = function () {
        location.href = '#estadosReportes/nuevo';
    }

    self.guardar = function () {
        request('estadosReportes', 'post', {
            equipo: self.d.equipo || null,
            local: self.d.local || null
        }).done(function () {
            location.href = '#estadosReportes';
        }).fail(function () {
            alert('No se pudo agregar el estado: '+self.d.equipo+'.');
        });
        return false;
    }

    self.modificar = function () {
        request('estadosReportes/'+self.equipos()[0].id(), 'put', {
            equipo: self.equipos()[0].equipo() || null,
            local: self.equipos()[0].local() || null
        }).done(function () {
            location.href = '#estadosReportes';
        }).fail(function () {
            alert('No se pudo modificar el equipo: '+self.equipos()[0].equipo()+'.');
        });
        return false;
    }

    self.editar = function (e) {
        location.href = '#estadosReportes/' + e.id();
    }

    self.eliminar = function (e) {
        request('estadosReportes/' + e.id(), 'DELETE').done(function () {
            self.cargar();
        }).fail(function () {
            alert('No se pudo eliminar el equipo: ' + e.equipo() + '.');
        });
    }

    self.cargar = function (e = "") {
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
        });
    }

    self.cargar(e_r);
}
////////

var urlMapping = {
    home: { match: /^$/, page: dashboard },
    usuarios: { match: /^usuarios$/, page: usuarios },
    usuarios_p: { match: /^usuarios\/(.+)$/, page: usuarios },
    locales: { match: /^locales$/, page: locales },
    locales_p: { match: /^locales\/(.+)$/, page: locales },
    equipos: { match: /^equipos$/, page: equipos },
    equipos_p: { match: /^equipos\/(.+)$/, page: equipos },
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

    return new Router.Page('Dashboard', 'home-template', { d: new modelo_dashboard });
}

function locales(param = "") {
    window.clearInterval(int);
    $('.nav-locales').addClass('active');
    $('.nav-dashboard').removeClass('active');
    $('.nav-usuarios').removeClass('active');
    $('.nav-equipos').removeClass('active');

    var l = new modelo_locales();

    if (param === "nuevo") {
        return new Router.Page('Locales', 'pg-nuevo-local', { l: l });
    } else if (param !== "" && !isNaN(param)) {
        return new Router.Page('Locales', 'pg-editar-local', { l: l, l2: new modelo_locales(param) });
    } else {
        int = window.setInterval(() => {
            l.cargar();
        }, 30000);
        return new Router.Page('Locales', 'pg-locales', { l: l });
    }
}

function usuarios(param = "") {
    window.clearInterval(int);
    $('.nav-usuarios').addClass('active');
    $('.nav-dashboard').removeClass('active');
    $('.nav-locales').removeClass('active');
    $('.nav-equipos').removeClass('active');

    if (param === "nuevo") {
        return new Router.Page('Usuarios', 'pg-nuevo-usuario', { u: new modelo_usuarios(), l: new modelo_locales() });
    } else if (param !== "") {
        return new Router.Page('Usuarios', 'pg-editar-usuario', { u: new modelo_usuarios(param), l: new modelo_locales() });
    } else {
        var u = new modelo_usuarios();
        int = window.setInterval(() => {
            u.cargar();
        }, 30000);

        return new Router.Page('Usuarios', 'pg-usuarios', { u: u });
    }
}

function equipos(param = "") {
    window.clearInterval(int);
    $('.nav-locales').removeClass('active');
    $('.nav-dashboard').removeClass('active');
    $('.nav-usuarios').removeClass('active');
    $('.nav-equipos').addClass('active');

    if (param === "nuevo") {
        return new Router.Page('Equipos', 'pg-nuevo-equipo', { e: new modelo_equipos() });
    } else if (param !== "") {
        if (param.toLowerCase().endsWith("/reportar")) {
            param = param.replace("/reportar", "").trim();
            return new Router.Page('Equipos', 'pg-reportar-equipo', { e: new modelo_equipos(param), e_r: new modelo_estados_reportes() });
        }
        return new Router.Page('Equipos', 'pg-editar-equipo', { e: new modelo_equipos(param), l: new modelo_locales() });
    } else {
        var e = new modelo_equipos();
        int = window.setInterval(() => {
            e.cargar();
        }, 30000);
        return new Router.Page('Equipos', 'pg-equipos', { e: e });
    }
}

function login() {
    var aut = getCookie("_aut");
    if (aut !== "") {
        location.href = "/";
    }
    $('body').empty();
    $('body').append("<div class=\"content container\"><div class=\"row\"><div class=\"col-lg-12\"><div id=\"login-form\" class=\"center-block d-block mx-auto col-lg-4 col-md-5\"><div class=\"card\"><div class=\"header\"><h4 class=\"title\">Autenticación</h4></div><div class=\"content\"><form id=\"frm-login\"><div class=\"row\"><div class=\"form-group\"><label>Usuario</label><input id=\"usr\" type=\"text\" class=\"form-control border-input\" placeholder=\"Usuario\"></div></div><div class=\"row\"><div class=\"form-group\"><label>Clave</label><input id=\"pass\" type=\"password\" class=\"form-control border-input\" placeholder=\"Clave\"></div></div><div class=\"text-center\"><button type=\"submit\" class=\"btn btn-info btn-fill btn-wd\">Entrar</button></div><div class=\"clearfix\"></div></form></div></div></div></div></div></div>");
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
document.body.appendChild(tipobj)

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
