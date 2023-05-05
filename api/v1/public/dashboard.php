<?php

final class dashboard {
    private $Bd;
    private $Raiz = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
    }

    public function get($a = null, $params = null) {
        $l = Local::obtTodos($this->Raiz);
        $ids = null;
        for ($i=0; $i < count($l); $i++) { 
            $ids = $ids.$l[$i]->id;
            if($i < count($l)-1){
                $ids = $ids.", ";
            }
        }

        $c_tv = $this->Bd->seleccionar("equipos", "id_local in ($ids) and id_tipo = 16 and id_estado = 3", "count(id) as cant")->fetch()['cant'];
        $t_c_tv = $this->Bd->seleccionar("equipos", "id_local in ($ids) and id_tipo = 16 and id_estado in (2, 3)", "count(id) as cant")->fetch()['cant'];
        $c_c = $this->Bd->seleccionar("equipos", "id_local in ($ids) and id_tipo in (1, 10, 11) and id_estado = 3", "count(id) as cant")->fetch()['cant'];
        $t_c_c = $this->Bd->seleccionar("equipos", "id_local in ($ids) and id_tipo in (1, 10, 11) and id_estado in (2, 3)", "count(id) as cant")->fetch()['cant'];
        $c_r = $this->Bd->seleccionar("reportes inner join equipos on (reportes.id_equipo = equipos.id)", "equipos.id_local in ($ids)", "count(reportes.id) as cant")->fetch()['cant'];
        $c_p_h = $this->Bd->seleccionar("prestamos inner join equipos on (prestamos.id_equipo = equipos.id)", "equipos.id_local in ($ids)", "count(prestamos.id) as cant")->fetch()['cant'];
        $c_p_r = $this->Bd->contarRegistros("prestamos", "id_local_dest in ($ids)");
        $c_pc = $this->Bd->seleccionar("equipos", "id_local in ($ids) and id_tipo = 1 and id_estado = 3", "count(id) as cant")->fetch()['cant'];
        $t_c_pc = $this->Bd->seleccionar("equipos", "id_local in ($ids) and id_tipo = 1 and id_estado in (2, 3)", "count(id) as cant")->fetch()['cant'];
        $c_c_l = $this->Bd->seleccionar("equipos", "id_local in ($ids) and id_tipo = 10 and id_estado = 3", "count(id) as cant")->fetch()['cant'];
        $t_c_c_l = $this->Bd->seleccionar("equipos", "id_local in ($ids) and id_tipo = 10 and id_estado in (2, 3)", "count(id) as cant")->fetch()['cant'];
        $c_s = $this->Bd->seleccionar("equipos", "id_local in ($ids) and id_tipo = 11 and id_estado = 3", "count(id) as cant")->fetch()['cant'];
        $t_c_s = $this->Bd->seleccionar("equipos", "id_local in ($ids) and id_tipo = 11 and id_estado in (2, 3)", "count(id) as cant")->fetch()['cant'];
        
        $t = new CDashboard($c_tv, $t_c_tv, $c_c, $t_c_c, $c_r, $c_p_h, $c_p_r, $c_pc, $t_c_pc, $c_c_l, $t_c_c_l, $c_s, $t_c_s);
        return $t;
    }

    public function post(array $data): int {
        return 0;
    }

    public function put($a, array $data): bool {
        return false;
    }

    public function delete($a): bool {
        return false;
    }
}