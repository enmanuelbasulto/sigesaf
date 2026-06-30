<?php

final class computadoras {
    private $Bd;
    private $Raiz = null;
    private $u_actual = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
        $this->u_actual = Usuario::getIdActual();
    }

    public function get($computadora = null, $params = null) {
        if($computadora != null) {
            if(is_numeric($computadora)){
                $d = $this->Bd->seleccionar("computadoras", "id = :id", '*', ['id' => $computadora])->fetch();
            }
            if ($d != null) {
                $c = Computadora::fromArray($d);
                if (Local::esHijoDe($c->id_local, $this->Raiz)) {
                    return $c;
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

        $d = $this->Bd->seleccionar("computadoras", "id_local in ($ids) $params")->fetchAll();
        if ($d != null) {
            foreach ($d as $key => $value) {
                $t[count($t)] = Computadora::fromArray($value);
            }
        }
        return $t;
    }

    public function post(array $data): int {
        if($data !== null){
            $c = Computadora::fromArray($data);
            if (Local::esHijoDe($c->id_local, $this->Raiz) && Local::esHijoDe(Equipo::getLocal($c->id_pc), $this->Raiz)) {
                
                $id_monitor = ($c->id_monitor !== null && Local::esHijoDe(Equipo::getLocal($c->id_monitor), $this->Raiz)) ? $c->id_monitor : null;
                $id_teclado = ($c->id_teclado !== null && Local::esHijoDe(Equipo::getLocal($c->id_teclado), $this->Raiz)) ? $c->id_teclado : null;
                $id_mouse = ($c->id_mouse !== null && Local::esHijoDe(Equipo::getLocal($c->id_mouse), $this->Raiz)) ? $c->id_mouse : null;
                $id_speaker = ($c->id_speaker !== null && Local::esHijoDe(Equipo::getLocal($c->id_speaker), $this->Raiz)) ? $c->id_speaker : null;
                $id_ups = ($c->id_ups !== null && Local::esHijoDe(Equipo::getLocal($c->id_ups), $this->Raiz)) ? $c->id_ups : null;
                $datos = [
                    'id_local' => $c->id_local,
                    'id_pc' => $c->id_pc,
                    'id_monitor' => $id_monitor,
                    'id_teclado' => $id_teclado,
                    'id_mouse' => $id_mouse,
                    'id_speaker' => $id_speaker,
                    'id_ups' => $id_ups,
                    'nombre' => $c->nombre,
                ];
                if($this->Bd->insertar("computadoras", $datos)){
                    $this->Bd->insertar("logs", ['tabla' => 'computadoras', 'tipo_cambio' => 0, 'id_usuario' => $this->u_actual, 'objeto' => $c->nombre]);
                    return $this->Bd->seleccionar("computadoras", "1 ORDER BY id DESC LIMIT 1", "id")->fetch()['id'];
                }
            }
        }
        
        return 0;
    }

    public function put($computadora, array $data): bool {
        if($computadora !== null && $data !== null){
            $d = $this->get($computadora);
            if ($d != null) {
                $c = Computadora::fromArray($data);
                if (Local::esHijoDe($c->id_local, $this->Raiz) && Local::esHijoDe(Equipo::getLocal($c->id_pc), $this->Raiz)) {

                    $id_monitor = ($c->id_monitor !== null && Local::esHijoDe(Equipo::getLocal($c->id_monitor), $this->Raiz)) ? $c->id_monitor : null;
                    $id_teclado = ($c->id_teclado !== null && Local::esHijoDe(Equipo::getLocal($c->id_teclado), $this->Raiz)) ? $c->id_teclado : null;
                    $id_mouse = ($c->id_mouse !== null && Local::esHijoDe(Equipo::getLocal($c->id_mouse), $this->Raiz)) ? $c->id_mouse : null;
                    $id_speaker = ($c->id_speaker !== null && Local::esHijoDe(Equipo::getLocal($c->id_speaker), $this->Raiz)) ? $c->id_speaker : null;
                    $id_ups = ($c->id_ups !== null && Local::esHijoDe(Equipo::getLocal($c->id_ups), $this->Raiz)) ? $c->id_ups : null;
                    $datos = [
                        'id_local' => $c->id_local,
                        'id_pc' => $c->id_pc,
                        'id_monitor' => $id_monitor,
                        'id_teclado' => $id_teclado,
                        'id_mouse' => $id_mouse,
                        'id_speaker' => $id_speaker,
                        'id_ups' => $id_ups,
                        'nombre' => $c->nombre,
                    ];
                    if($this->Bd->actualizar("computadoras", $datos, "id = $d->id")){
                        $this->Bd->insertar("logs", ['tabla' => 'computadoras', 'tipo_cambio' => 2, 'id_usuario' => $this->u_actual, 'objeto' => $c->nombre]);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public function delete($computadora): bool {
        if($computadora !== null){
            $d = $this->get($computadora);
            if ($d != null) {
                if (Local::esHijoDe($d->id_local, $this->Raiz)) {
                    if($this->Bd->eliminar("computadoras", "id = :id", ['id' => $d->id])){
                        $this->Bd->insertar("logs", ['tabla' => 'computadoras', 'tipo_cambio' => 3, 'id_usuario' => $this->u_actual, 'objeto' => $d->nombre]);
                        return true;
                    }
                }
                
            }
        }
        return false;
    }
}