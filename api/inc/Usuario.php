<?php

final class Usuario {
    public $id = null;
    public $usuario = null;
    public $nombre = null;
    public $rol = 'tecnico';
    public $clave = null;
    public $id_local = 0;
    public $local = null;
    
    public function __construct(int $id = null, string $usuario = null, string $nombre = null, string $clave = null, string $rol = 'tecnico', int $id_local = 0, string $local = null) {
        $this->id = $id;
        $this->usuario = $usuario;
        $this->nombre = $nombre;
        $this->clave = $clave;
        $this->rol = $rol ?: 'tecnico';
        $this->id_local = $id_local;
        $this->local = $local;
    }

    public static function fromArray(array $data): Usuario {
        return new Usuario($data['id'], $data['usuario'], $data['nombre'], $data['clave'], $data['rol'], $data['id_local'], $data['local']);
    }

    public static function getId(string $usuario): int {
        $bd = new Bd();
        return $bd->seleccionar("usuarios", "usuario = '$usuario'", "id")->fetch()['id'];
    }

    public static function getLocal(string $usuario): int {
        if($usuario == null){
            return -1;
        }
        $bd = new Bd();
        return $bd->seleccionar("usuarios", "usuario = '$usuario'", "id_local")->fetch()['id_local'];
    }

    public static function getIdActual(): int {
        return Usuario::getId($_SERVER['PHP_AUTH_USER']);
    }

    public static function authenticate($usuario, $clave): bool {
        $bd = new Bd();
        $clave = sha1($clave);
        return $bd->contarRegistros("usuarios", "usuario = '$usuario' and clave = '$clave'");
    }

    public static function getRol($usuario): string {
        $bd = new Bd();
        return $bd->seleccionar("usuarios", "usuario = '$usuario'", "rol")->fetch()["rol"] ?? 'tecnico';
    }

    public static function isAdmin($usuario): bool {
        return Usuario::getRol($usuario) === 'administrador';
    }

    public static function passwd($usuario, $clave, $clave_nueva): bool {
        if(Usuario::authenticate($usuario, $clave)) {
            $bd = new Bd();
            $clave_nueva = sha1($clave_nueva);
            return $bd->actualizar("usuarios", "clave = '$clave_nueva'", "$usuario = '$usuario'");
        }
        return false;
    }
}