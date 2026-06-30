<?php

final class equipos {
    private $Bd;
    private $Raiz = null;
    private $u_actual = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
        $this->u_actual = Usuario::getIdActual();
    }

    public function get($equipo = null, $params = null) {
        if($equipo != null) {
            if(is_numeric($equipo)){
                $d = $this->Bd->seleccionar("equipos", "id = :id", '*', ['id' => $equipo])->fetch();
            }
            
            if ($d != null) {
                $e = Equipo::fromArray($d);
                if (Local::esHijoDe($e->id_local, $this->Raiz)) {
                    return $e;
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

        $d = $this->Bd->seleccionar("equipos left join locales on equipos.id_local = locales.id left join marcas on equipos.id_marca = marcas.id left join tipos_equipos on equipos.id_tipo = tipos_equipos.id left join estados_equipos on equipos.id_estado = estados_equipos.id", "equipos.id_local in ($ids) $params", "equipos.*, locales.local as 'local', marcas.marca as 'marca', tipos_equipos.tipo as 'tipo', estados_equipos.estado as 'estado'")->fetchAll();
        if ($d != null) {
            foreach ($d as $key => $value) {
                $t[count($t)] = Equipo::fromArray($value);
            }
        }
        return $t;
    }

    public function post(array $data): int {
        if($data !== null){
            $e = Equipo::fromArray($data);
            if (Local::esHijoDe($e->id_local, $this->Raiz)) {
                $datos = [
                    'id_local' => $e->id_local,
                    'no_inv' => $e->no_inv,
                    'observaciones' => $e->observaciones,
                    'id_marca' => $e->id_marca,
                    'id_tipo' => $e->id_tipo,
                    'id_estado' => $e->id_estado,
                    'sello' => !empty($e->sello) ? $e->sello : null,
                    'modelo' => !empty($e->modelo) ? $e->modelo : null,
                    'numero_serie' => !empty($e->numero_serie) ? $e->numero_serie : null,
                    'fecha_compra' => !empty($e->fecha_compra) ? $e->fecha_compra : null,
                    'garantia' => !empty($e->garantia) ? $e->garantia : null,
                    'responsable' => !empty($e->responsable) ? $e->responsable : null,
                    'codigo_qr' => !empty($e->codigo_qr) ? $e->codigo_qr : null,
                ];
                if($this->Bd->insertar("equipos", $datos)){
                    $this->Bd->insertar("logs", ['tabla' => 'equipos', 'tipo_cambio' => 0, 'id_usuario' => $this->u_actual, 'objeto' => $e->no_inv]);
                    return $this->Bd->seleccionar("equipos", "1", "max(id) as id")->fetch()['id'];
                }
            }
        }
        
        return 0;
    }

    public function put($equipo, array $data): bool {
        if($equipo !== null && $data !== null){
            $d = $this->get($equipo);
            if ($d != null) {
                $e = Equipo::fromArray($data);
                if (Local::esHijoDe($e->id_local, $this->Raiz)) {
                    $sello = !empty($e->sello) ? $e->sello : null;
                    $modelo = !empty($e->modelo) ? $e->modelo : null;
                    $numero_serie = !empty($e->numero_serie) ? $e->numero_serie : null;
                    $fecha_compra = !empty($e->fecha_compra) ? $e->fecha_compra : null;
                    $garantia = !empty($e->garantia) ? $e->garantia : null;
                    $responsable = !empty($e->responsable) ? $e->responsable : null;
                    $codigo_qr = !empty($e->codigo_qr) ? $e->codigo_qr : null;
                    if (Usuario::isAdmin($_SERVER['PHP_AUTH_USER'])) {
                        $datos = [
                            'id_local' => $e->id_local,
                            'no_inv' => $e->no_inv,
                            'observaciones' => $e->observaciones,
                            'id_marca' => $e->id_marca,
                            'id_tipo' => $e->id_tipo,
                            'id_estado' => $e->id_estado,
                            'sello' => $sello,
                            'modelo' => $modelo,
                            'numero_serie' => $numero_serie,
                            'fecha_compra' => $fecha_compra,
                            'garantia' => $garantia,
                            'responsable' => $responsable,
                            'codigo_qr' => $codigo_qr,
                        ];
                        if($this->Bd->actualizar("equipos", $datos, "id = $d->id")){
                            $this->Bd->insertar("logs", ['tabla' => 'equipos', 'tipo_cambio' => 2, 'id_usuario' => $this->u_actual, 'objeto' => $e->no_inv]);
                            return true;
                        }
                    }
                    if($this->Bd->actualizar("equipos", ['observaciones' => $e->observaciones, 'sello' => $sello], "id = $d->id")){
                        $this->Bd->insertar("logs", ['tabla' => 'equipos', 'tipo_cambio' => 2, 'id_usuario' => $this->u_actual, 'objeto' => $e->no_inv]);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public function delete($equipo): bool {
        if($equipo !== null){
            $d = $this->get($equipo);
            if ($d != null) {
                if($d->equipo == $_SERVER['PHP_AUTH_USER']){
                    throw new ForbiddenException("No se puede eliminar el equipo actual.", 1);
                }
                if (Local::esHijoDe($d->id_local, $this->Raiz)) {
                    if($this->Bd->eliminar("equipos", "id = :id", ['id' => $d->id])){
                        $this->Bd->insertar("logs", ['tabla' => 'equipos', 'tipo_cambio' => 3, 'id_usuario' => $this->u_actual, 'objeto' => $d->no_inv]);
                        return true;
                    }
                }
                
            }
        }
        return false;
    }
}