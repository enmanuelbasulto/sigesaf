<?php

final class Local {
    public $id = null;
    public $local = null;
    public $id_padre = 0;
    public $hijos = array();
    private static $r = null;
    
    public function __construct(int $id = null, string $local = null, $id_padre = null) {
        $this->id = $id;
        $this->local = $local;
        $this->id_padre = (int) $id_padre;
    }

    public static function fromArray(array $data): Local {
        return new Local($data['id'], $data['local'], $data['id_padre']);
    }

    public function arbol(array $data): array {
        foreach($data as $l){
            if ($l['id_padre'] == $this->id) {
                $this->hijos[count($this->hijos)] = Local::fromArray($l);
                $this->hijos[count($this->hijos)-1]->arbol($data);
            }
        }
        return $this->hijos;
    }

    public static function esHijoDe($local, $padre): bool {
        $consulta = "with recursive arbol as (select * from locales where id = $local union all select child.* from locales as child join arbol as parent on parent.id_padre = child.id) select count(id) as r from arbol where id = $padre";
        $bd = new Bd();
        $r = $bd->ejecutar($consulta)->fetch()['r'];
        return $r;
    }

    public static function obtTodos($raiz, $params = null) {
        if(empty($params)){
            $params = 1;
        }
        $consulta = "with recursive arbol as (select * from locales where id = $raiz union all select child.* from locales as child join arbol as parent on parent.id = child.id_padre) select * from arbol where $params";
        $bd = new Bd();
        $r = $bd->ejecutar($consulta)->fetchAll();
        $t = Local::fromArray($r[0]);
        $t->arbol($r);
        return $t;
    }
}