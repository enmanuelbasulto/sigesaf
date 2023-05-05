<?php

final class tiposEquipos {
    private $Bd;
    private $Raiz = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
    }

    public function get($tipo = null, $params = null) {
        $t = array();
        if($tipo != null) {
            if(is_numeric($tipo)){
                $d = $this->Bd->seleccionar("tipos_equipos", "id = $tipo")->fetch();
            }
            if ($d != null) {
                $t = Tipo::fromArray($d);
                
                return $t;
            }
            return null;
        }
        $d = $this->Bd->seleccionar("tipos_equipos")->fetchAll();
        if ($d != null) {
            foreach ($d as $key => $value) {
                $t[count($t)] = Tipo::fromArray($value);
            }
        }
        return $t;
    }
//terminar aqui
    public function post(array $data): int {
        if($data !== null){
            $t = Tipo::fromArray($data);
                if($this->Bd->insertar("tipos_equipos", "'$t->tipo', '$t->descripcion'", "tipo, descripcion")){
                    return $this->Bd->seleccionar("tipos_equipos", "1 ORDER BY id DESC LIMIT 1", "id")->fetch()['id'];
                }
        }
        return 0;
    }

    public function put($tipo, array $data): bool {
        if(Usuario::isAdmin($_SERVER['PHP_AUTH_USER']) && $tipo !== null && $data !== null){
            $d = $this->get($tipo);
            if ($d != null) {
                $t = Tipo::fromArray($data);
                    if($this->Bd->actualizar("tipos_equipos", "tipo = '$t->tipo', descripcion = '$t->descripcion'", "id = $d->id")){
                        return true;
                    }
            }
        }
        return false;
    }

    public function delete($tipo): bool {
        if($tipo !== null){
            $d = $this->get($tipo);
            if ($d != null) {
                if($d->tipo == $_SERVER['PHP_AUTH_USER']){
                    throw new ForbiddenException("No se puede eliminar el tipo de equipo actual.", 1);
                }
                    if($this->Bd->eliminar("tipos_equipos", "tipo = '$d->tipo'")){
                        return true;
                    }
                
            }
        }
        return false;
    }
}