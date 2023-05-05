<?php

final class arbol {
    private $Bd;
    private $Raiz = null;
    private $local = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
    }

    public function get($id = null, string $params = null) {
        if($id != null) {
            $d = $this->Bd->seleccionar("locales", "id = $id")->fetch();
            if ($d != null) {
                $l = Local::fromArray($d);
                if (Local::esHijoDe($l->id, $this->Raiz)) {
                    return Local::obtTodos($l->id, $params);
                }
            }
            return null;
        }
        
        return Local::obtTodos($this->Raiz, $params);
    }

    public function post(array $data): int {
        if($data !== null){
            $l = Local::fromArray($data);
            if (Local::esHijoDe($l->id_padre, $this->Raiz)) {
                if($this->Bd->insertar("locales", "'$l->local', $l->id_padre", "local, id_padre")){
                    return $this->Bd->seleccionar("locales", "1", "max(id)")->fetch()['id'];
                }
            }
        }
        return 0;
    }

    public function put($local, array $data): bool {
        if($local !== null && $data !== null){
            $d = $this->get($local);
            if ($d != null) {
                $l = Local::fromArray($data);
                if (Local::esHijoDe($l->id_padre, $this->Raiz)) {
                    if($this->Bd->actualizar("locales", "local = '$l->local', id_padre = $l->id_padre", "id = $d->id")){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public function delete($local): bool {
        if($local !== null){
            $d = $this->get($local);
            if ($d != null) {
                if($d->id == $this->Raiz){
                    throw new ForbiddenException("No se puede eliminar el local actual.", 1);
                }
                if (Local::esHijoDe($d->id, $this->Raiz)) {
                    if($this->Bd->eliminar("locales", "id = $d->id")){
                        return true;
                    }
                }
            }
        }
        return false;
    }
}