<?php

final class Local {
    public $id = null;
    public $local = null;
    public $id_padre = 0;
    private static $r = null;
    
    public function __construct(int $id = null, string $local = null, $id_padre = null) {
        $this->id = $id;
        $this->local = $local;
        $this->id_padre = (int) $id_padre;
    }

    public static function fromArray(array $data): Local {
        return new Local($data['id'], $data['local'], $data['id_padre']);
    }

    public static function esHijoDe($local, $padre): bool {
        $bd = new Bd();
        $consulta = "with recursive arbol as (select * from locales where id = $local union all select child.* from locales as child join arbol as parent on parent.id_padre = child.id) select count(id) as r from arbol where id = $padre";
        $r = $bd->ejecutar($consulta)->fetch()['r'];
        return $r;
    }

    public static function obtTodos($raiz, $params = null) {
        if(empty($params)){
            $params = 1;
        }
        $bd = new Bd();
        $consulta = "with recursive arbol as (select * from locales where id = $raiz union all select child.* from locales as child join arbol as parent on parent.id = child.id_padre) select * from arbol where $params";
        $r = $bd->ejecutar($consulta)->fetchAll();
        $t = array();
        foreach ($r as $v) {
            $t[count($t)] = Local::fromArray($v);
        }
        return $t;
    }
    
}