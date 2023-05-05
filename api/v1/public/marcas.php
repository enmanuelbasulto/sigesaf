<?php

final class marcas {
    private $Bd;
    private $Raiz = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
    }

    public function get($marca = null, $params = null) {
        $m = array();
        if($marca != null) {
            if(is_numeric($marca)){
                $d = $this->Bd->seleccionar("marcas", "id = $marca")->fetch();
            }
            if ($d != null) {
                $m = Marca::fromArray($d);
                
                return $m;
            }
            return null;
        }
        $d = $this->Bd->seleccionar("marcas")->fetchAll();
        if ($d != null) {
            foreach ($d as $key => $value) {
                $m[count($m)] = Marca::fromArray($value);
            }
        }
        return $m;
    }
//terminar aqui
    public function post(array $data): int {
        if($data !== null){
            $m = Marca::fromArray($data);
                if($this->Bd->insertar("marcas", "'$m->marca'", "marca")){
                    return $this->Bd->seleccionar("marcas", "1 ORDER BY id DESC LIMIT 1", "id")->fetch()['id'];
                }
        }
        return 0;
    }

    public function put($marca, array $data): bool {
        if(Usuario::isAdmin($_SERVER['PHP_AUTH_USER']) && $marca !== null && $data !== null){
            $d = $this->get($marca);
            if ($d != null) {
                $m = Marca::fromArray($data);
                    if($this->Bd->actualizar("marcas", "marca = '$m->marca'", "id = $d->id")){
                        return true;
                    }
            }
        }
        return false;
    }

    public function delete($marca): bool {
        if($marca !== null){
            $d = $this->get($marca);
            if ($d != null) {
                if($d->marca == $_SERVER['PHP_AUTH_USER']){
                    throw new ForbiddenException("No se puede eliminar la marca.", 1);
                }
                    if($this->Bd->eliminar("marcas", "marca = '$d->marca'")){
                        return true;
                    }
                
            }
        }
        return false;
    }
}