<?php

final class reportes {
    private $Bd;
    private $Raiz = null;
    private $u_actual = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
        $this->u_actual = Usuario::getIdActual();
    }

    public function get($reporte = null, $params = null) {
        if($reporte != null) {
            if(is_numeric($reporte)){
                $d = $this->Bd->seleccionar("reportes inner join equipos on (reportes.id_equipo = equipos.id)", "reportes.id = :id", "reportes.*, equipos.no_inv as equipo", ['id' => $reporte])->fetch();
            }
            
            if ($d != null) {
                $r = Reporte::fromArray($d);
                if (Local::esHijoDe(Reporte::getLocal($r->id), $this->Raiz)) {
                    return $r;
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

        $d = $this->Bd->ejecutar("select reportes.*, usuarios.nombre as usuario, equipos.no_inv as equipo, locales.local, marcas.marca, tipos_equipos.tipo, estados_reportes.estado from reportes inner join usuarios on (reportes.id_usuario = usuarios.id) inner join equipos on (reportes.id_equipo = equipos.id) left join locales on equipos.id_local = locales.id left join marcas on equipos.id_marca = marcas.id left join tipos_equipos on equipos.id_tipo = tipos_equipos.id inner join estados_reportes on (reportes.id_estado = estados_reportes.id) where equipos.id_local in ($ids) $params")->fetchAll();
        if ($d != null) {
            foreach ($d as $key => $value) {
                $t[count($t)] = Reporte::fromArray($value);
            }
        }
        return $t;
    }

    public function post(array $data): int {
        if($data !== null){
            $r = Reporte::fromArray($data);
            if (Local::esHijoDe(Equipo::getLocal($r->id_equipo), $this->Raiz)) {
                $id_usuario = Usuario::getId($_SERVER['PHP_AUTH_USER']);
                $datos = [
                    'problema' => $r->problema,
                    'id_usuario' => $id_usuario,
                    'id_equipo' => $r->id_equipo,
                    'id_estado' => $r->id_estado,
                    'tecnico_asignado' => !empty($r->tecnico_asignado) ? $r->tecnico_asignado : null,
                    'acciones_realizadas' => !empty($r->acciones_realizadas) ? $r->acciones_realizadas : null,
                    'repuestos_usados' => !empty($r->repuestos_usados) ? $r->repuestos_usados : null,
                    'tiempo_reparacion' => !empty($r->tiempo_reparacion) ? $r->tiempo_reparacion : null,
                ];
                
                if($this->Bd->insertar("reportes", $datos)){
                    $id_equipo = (int) $r->id_equipo;
                    if ($r->id_estado == 1) {
                        $this->Bd->ejecutar("UPDATE equipos SET id_estado = 2 WHERE id = :id", ['id' => $id_equipo]);
                    } elseif ($r->id_estado == 2) {
                        $this->Bd->ejecutar("UPDATE equipos SET id_estado = 4 WHERE id = :id", ['id' => $id_equipo]);
                    } elseif ($r->id_estado == 3) {
                        $this->Bd->ejecutar("UPDATE equipos SET id_estado = 1 WHERE id = :id", ['id' => $id_equipo]);
                    }
                    $a = $this->Bd->seleccionar("reportes", "1 ORDER BY id DESC LIMIT 1", "id")->fetch()['id'];
                    $this->Bd->insertar("logs", ['tabla' => 'reportes', 'tipo_cambio' => 0, 'id_usuario' => $this->u_actual, 'objeto' => $a]);
                    return $a;
                }
            }
        }
        
        return 0;
    }

    public function put($reporte, array $data): bool {
        if($reporte !== null && $data !== null){
            $d = $this->get($reporte);
            if ($d != null) {
                $r = Reporte::fromArray($data);
                if (Local::esHijoDe(Reporte::getLocal($d->id), $this->Raiz)) {
                    $datos = [
                        'problema' => $r->problema,
                        'id_estado' => $r->id_estado,
                        'tecnico_asignado' => !empty($r->tecnico_asignado) ? $r->tecnico_asignado : null,
                        'acciones_realizadas' => !empty($r->acciones_realizadas) ? $r->acciones_realizadas : null,
                        'repuestos_usados' => !empty($r->repuestos_usados) ? $r->repuestos_usados : null,
                        'tiempo_reparacion' => !empty($r->tiempo_reparacion) ? $r->tiempo_reparacion : null,
                    ];
                    if($this->Bd->actualizar("reportes", $datos, "id = $d->id")){
                        $this->Bd->insertar("logs", ['tabla' => 'reportes', 'tipo_cambio' => 2, 'id_usuario' => $this->u_actual, 'objeto' => $d->id]);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public function delete($reporte): bool {
        if($reporte !== null){
            $d = $this->get($reporte);
            if ($d != null) {
                if (Local::esHijoDe(Reporte::getLocal($d->id), $this->Raiz)) {
                    if($this->Bd->eliminar("reportes", "id = :id", ['id' => $d->id])){
                        $this->Bd->insertar("logs", ['tabla' => 'reportes', 'tipo_cambio' => 3, 'id_usuario' => $this->u_actual, 'objeto' => $d->id]);
                        return true;
                    }
                }
                
            }
        }
        return false;
    }
}