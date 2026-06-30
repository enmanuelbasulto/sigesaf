<?php

final class usuarios {
    private $Bd;
    private $Raiz = null;
    private $u_actual = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
        $this->u_actual = Usuario::getIdActual();
    }

    public function get($usuario = null, $params = null) {
        if($usuario != null) {
            if(is_numeric($usuario)){
                $d = $this->Bd->seleccionar("usuarios left join locales on usuarios.id_local = locales.id", "usuarios.id = :id", "usuarios.*, locales.local", ['id' => $usuario])->fetch();

            } else {

                $d = $this->Bd->seleccionar("usuarios left join locales on usuarios.id_local = locales.id", "usuarios.usuario = :usr", "usuarios.*, locales.local as `local`", ['usr' => $usuario])->fetch();
            }
            if ($d != null) {
                $u = Usuario::fromArray($d);
                if (Local::esHijoDe($u->id_local, $this->Raiz)) {
                    return $u;
                }
            }
            return null;
        }

        $t = array();
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

        $d = $this->Bd->seleccionar("usuarios left join locales on usuarios.id_local = locales.id", "usuarios.id_local in ($ids) $params", "usuarios.*, locales.local as 'local'")->fetchAll();
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
                $clave = sha1($u->clave);
                $rol = $u->rol ?: 'tecnico';

                if($this->Bd->insertar("usuarios", ['usuario' => $u->usuario, 'nombre' => $u->nombre, 'clave' => $clave, 'rol' => $rol, 'id_local' => $u->id_local])){
                    
                    $this->Bd->insertar("logs", ['tabla' => 'usuarios', 'tipo_cambio' => 0, 'id_usuario' => $this->u_actual, 'objeto' => $u->usuario]);
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
                    $rol = $u->rol ?: 'tecnico';
                    $usuario_u = $u->usuario;
                    $id_local = $u->id_local;

                    if ($this->u_actual == $d->id || !Usuario::isAdmin($_SERVER['PHP_AUTH_USER'])) {
                        $rol = $d->rol;
                        $usuario_u = $d->usuario;
                        $id_local = $d->id_local;
                    }
                    if($this->Bd->actualizar("usuarios", ['usuario' => $usuario_u, 'nombre' => $u->nombre, 'rol' => $rol, 'id_local' => $id_local], "id = $d->id")){
                        $this->Bd->insertar("logs", ['tabla' => 'usuarios', 'tipo_cambio' => 2, 'id_usuario' => $this->u_actual, 'objeto' => $u->usuario]);
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
                    if($this->Bd->eliminar("usuarios", "usuario = :usr", ['usr' => $d->usuario])){
                        $this->Bd->insertar("logs", ['tabla' => 'usuarios', 'tipo_cambio' => 3, 'id_usuario' => $this->u_actual, 'objeto' => $d->usuario]);
                        return true;
                    }
                }
                
            }
        }
        return false;
    }
}