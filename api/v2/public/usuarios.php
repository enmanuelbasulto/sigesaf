<?php

final class usuarios {
    private $Bd;
    private $Raiz = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
    }

    public function get($usuario = null, $params = null) {
        if($usuario != null) {
            if(is_numeric($usuario)){
                $d = $this->Bd->seleccionar("usuarios", "id = $usuario")->fetch();
            } else {
                $d = $this->Bd->seleccionar("usuarios", "usuario = '$usuario'")->fetch();
            }
            if ($d != null) {
                $u = Usuario::fromArray($d);
                if (Local::esHijoDe($u->id_local, $this->Raiz)) {
                    return $u;
                }
            }
            return null;
        }

        $t = null;
        $l = Local::obtTodos($this->Raiz);
        if(!empty($params)){
            $params = "&&".$params;
        }
        $ids = null;
        for ($i=0; $i < count($l); $i++) { 
            $ids = $ids.$l[$i]->id;
            if($i < count($l)-1){
                $ids = $ids.", ";
            }
        }

        $d = $this->Bd->seleccionar("usuarios", "id_local in ($ids) $params")->fetchAll();
        if ($d != null) {
            foreach ($d as $key => $value) {
                $t[count($t)] = Usuario::fromArray($value);
            }
        }
        return $t;
    }

    public function post(array $data): int {
        if($data !== null){
            $u = Usuario::fromArray($data);
            if (Local::esHijoDe($u->id_local, $this->Raiz)) {
                $admin = (int) $u->admin;

                if($this->Bd->insertar("usuarios", "'$u->usuario', '$u->nombre', $admin, $u->id_local", "usuario, nombre, admin, id_local")){
                    return $this->Bd->seleccionar("usuarios", "1 ORDER BY id DESC LIMIT 1", "id")->fetch()['id'];
                }
            }
        }
        return 0;
    }

    public function put($usuario, array $data): bool {
        if($usuario !== null && $data !== null){
            $d = $this->get($usuario);
            if ($d != null) {
                $u = Usuario::fromArray($data);
                if (Local::esHijoDe($u->id_local, $this->Raiz)) {
                    $admin = (int) $u->admin;
                    if($this->Bd->actualizar("usuarios", "usuario = '$u->usuario', nombre = '$u->nombre', admin = $admin, id_local = $u->id_local", "id = $d->id")){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public function delete($usuario): bool {
        if($usuario !== null){
            $d = $this->get($usuario);
            if ($d != null) {
                if($d->usuario == $_SERVER['PHP_AUTH_USER']){
                    throw new ForbiddenException("No se puede eliminar el usuario actual.", 1);
                }
                if (Local::esHijoDe($d->id_local, $this->Raiz)) {
                    if($this->Bd->eliminar("usuarios", "usuario = '$d->usuario'")){
                        return true;
                    }
                }
                
            }
        }
        return false;
    }
}