<?php

final class estadosEquipos {
    private $Bd;
    private $Raiz = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
    }

    public function get($id_eEquipo = null, $params = null) {
        $ee = array();
        if($id_eEquipo != null) {
            if(is_numeric($id_eEquipo)){
                $d = $this->Bd->seleccionar("estados_equipos", "id = $id_eEquipo")->fetch();
            }
            if ($d != null) {
                $ee = EstadoEquipo::fromArray($d);
                
                return $ee;
            }
            return null;
        }
        $d = $this->Bd->seleccionar("estados_equipos")->fetchAll();
        if ($d != null) {
            foreach ($d as $key => $value) {
                $ee[count($ee)] = EstadoEquipo::fromArray($value);
            }
        }
        return $ee;
    }
//terminar aqui
    public function post(array $data): int {
        if($data !== null){
            $ee = EstadoEquipo::fromArray($data);
                if($this->Bd->insertar("estados_equipos", "'$ee->estado', '$ee->descripcion'", "estado, descripcion")){
                    return $this->Bd->seleccionar("estados_equipos", "1 ORDER BY id DESC LIMIT 1", "id")->fetch()['id'];
                }
        }
        return 0;
    }

    public function put($id_eEquipo, array $data): bool {
        if(Usuario::isAdmin($_SERVER['PHP_AUTH_USER']) && $id_eEquipo !== null && $data !== null){
            $d = $this->get($id_eEquipo);
            if ($d != null) {
                $ee = EstadoEquipo::fromArray($data);
                    if($this->Bd->actualizar("estados_equipos", "estado = '$ee->estado', descripcion = '$ee->descripcion'", "id = $d->id")){
                        return true;
                    }
            }
        }
        return false;
    }

    public function delete($id_eEquipo): bool {
        if($id_eEquipo !== null){
            $d = $this->get($id_eEquipo);
            if ($d != null) {
                if($d->estado == $_SERVER['PHP_AUTH_USER']){
                    throw new ForbiddenException("No se puede eliminar el estado del reporte actual.", 1);
                }
                    if($this->Bd->eliminar("estados_equipos", "estado = '$d->estado'")){
                        return true;
                    }
                
            }
        }
        return false;
    }
}