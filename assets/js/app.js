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

var urlMapping = {
    home: { match: /^$/, page: dashboard },
    usuarios: { match: /^usuarios$/, page: usuarios },
    usuarios_p: { match: /^usuarios\/(.+)$/, page: usuarios },
    login: { match: /^login$/, page: login },
    logoff: { match: /^logoff$/, page: logoff },
    config: { match: /^config$/, page: config },
    fail: { match: /^fail$/, page: failPage }
}

function dashboard() {
    window.clearInterval(int);
    $('#nav-dashboard').addClass('active');
    $('#nav-usuarios').removeClass('active');
    $('#nav-locales').removeClass('active');

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

    return new Router.Page('Dashboard', 'home-template', { d: new modelo_dashboard });
}

function usuarios(param = "") {
    window.clearInterval(int);
    $('#nav-usuarios').addClass('active');
    $('#nav-dashboard').removeClass('active');
    $('#nav-locales').removeClass('active');

    function modelo_usuarios() {
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
                        id_local: ko.observable(d.id_local)
                    });
                } else {
                    for (var i = 0; i < d.length; i++) {
                        self.usuarios.push({
                            id: ko.observable(d[i].id),
                            usuario: ko.observable(d[i].usuario),
                            nombre: ko.observable(d[i].nombre),
                            admin: ko.observable(d[i].admin),
                            id_local: ko.observable(d[i].id_local)
                        });
                    }
                }
            });
        }
    }
    var u = new modelo_usuarios();

    if (param === "nuevo") {
        return new Router.Page('Usuarios', 'pg-nuevo-usuario', { u: u });
    } else if (param !== "") {
        u.cargar(param);
        return new Router.Page('Usuarios', 'pg-editar-usuario', { u: u });
    } else {
        u.cargar();
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