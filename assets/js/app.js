var int = null;

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
        type: verb,
        url: 'https://api.sigesaf.com/v1/' + ep,
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
        $("#loader").fadeOut();
        $("#body").fadeIn();
    });
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

    self.cargar = function () {
        request('dashboard').done(function (d) {
            self.c_u(d.cantidadUsuarios),
            self.c_c(d.cantidadComputadoras),
            self.c_r(d.cantidadReportes),
            self.c_p_h(d.cantidadPrestamosHechos),
            self.c_p_r(d.cantidadPrestamosRecibidos)
        });
    }

    self.cargar();
    int = window.setInterval(() => {
        self.cargar();
    }, 10000);
}

function modelo_locales() {
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
                    id_padre: ko.observable(d.id_padre)
                });
            } else {
                for (var i = 0; i < d.length; i++) {
                    self.locales.push({
                        id: ko.observable(d[i].id),
                        local: ko.observable(d[i].local),
                        id_padre: ko.observable(d[i].id_padre)
                    });
                }
            }
        });
    }
    self.cargar();
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
////////

var urlMapping = {
    home: { match: /^$/, page: dashboard },
    usuarios: { match: /^usuarios$/, page: usuarios },
    usuarios_p: { match: /^usuarios\/(.+)$/, page: usuarios },
    locales: { match: /^locales$/, page: locales },
    locales_p: { match: /^locales\/(.+)$/, page: locales },
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

    return new Router.Page('Dashboard', 'home-template', { d: new modelo_dashboard });
}

function locales(param = "") {
    window.clearInterval(int);
    $('.nav-locales').addClass('active');
    $('.nav-dashboard').removeClass('active');
    $('.nav-usuarios').removeClass('active');

    var l = new modelo_locales();

    if (param === "nuevo") {
        return new Router.Page('Locales', 'pg-nuevo-local', { l: l });
    } else if (param !== "") {
        l.cargar(param);
        return new Router.Page('Locales', 'pg-editar-local', { l: l });
    } else {
        int = window.setInterval(() => {
            l.cargar();
        }, 10000);
        return new Router.Page('Locales', 'pg-locales', { l: l });
    }
}

function usuarios(param = "") {
    window.clearInterval(int);
    $('.nav-usuarios').addClass('active');
    $('.nav-dashboard').removeClass('active');
    $('.nav-locales').removeClass('active');

    var u = new modelo_usuarios(param);

    if (param === "nuevo") {
        return new Router.Page('Usuarios', 'pg-nuevo-usuario', { u: u, l: new modelo_locales() });
    } else if (param !== "") {
        u.cargar(param);
        return new Router.Page('Usuarios', 'pg-editar-usuario', { u: u, l: new modelo_locales() });
    } else {
        int = window.setInterval(() => {
            u.cargar();
        }, 10000);
        return new Router.Page('Usuarios', 'pg-usuarios', { u: u });
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