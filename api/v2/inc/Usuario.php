<?php

final class Usuario {
    public $id = null;
    public $usuario = null;
    public $nombre = null;
    public $admin = false;
    public $id_local = 0;
    
    public function __construct(int $id = null, string $usuario = null, string $nombre = null, bool $admin = false, int $id_local = 0) {
        $this->id = $id;
        $this->usuario = $usuario;
        $this->nombre = $nombre;
        if($admin != null){
            $this->admin = $admin;
        }
        $this->id_local = $id_local;
    }

    public static function fromArray(array $data): Usuario {
        return new Usuario($data['id'], $data['usuario'], $data['nombre'], $data['admin'], $data['id_local']);
    }

    public static function getLocal(string $usuario): int {
        $bd = new Bd();
        return $bd->seleccionar("usuarios", "usuario = '$usuario'", "id_local")->fetch()['id_local'];
    }

    public static function authenticate($usuario, $clave): bool {
        $bd = new Bd();
        $clave = sha1($clave);
        return $bd->contarRegistros("usuarios", "usuario = '$usuario' and clave = '$clave'");
    }

    public static function isAdmin($usuario): bool {
        $bd = new Bd();
        return $bd->seleccionar("usuarios", "usuario = '$usuario'", "admin")->fetch()["admin"];
    }

    public static function passwd($usuario, $clave, $clave_nueva): bool {
        if(authenticate($usuario, $clave)) {
            $bd = new Bd();
            $clave_nueva = sha1($clave_nueva);
            return $bd->actualizar("usuarios", "clave = '$clave_nueva'", "$usuario = '$usuario'");
        }
        return false;
    }
}