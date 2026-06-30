<?php

final class estadosReportes {
    private $Bd;
    private $Raiz = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
    }

    public function get($idReporte = null, $params = null) {
        $er = array();
        if($idReporte != null) {
            if(is_numeric($idReporte)){
                $d = $this->Bd->seleccionar("estados_reportes", "id = $idReporte")->fetch();
            }
            if ($d != null) {
                $er = EstadoReporte::fromArray($d);
                
                return $er;
            }
            return null;
        }
        $d = $this->Bd->seleccionar("estados_reportes")->fetchAll();
        if ($d != null) {
            foreach ($d as $key => $value) {
                $er[count($er)] = EstadoReporte::fromArray($value);
            }
        }
        return $er;
    }
//terminar aqui
    public function post(array $data): int {
        if($data !== null){
            $er = EstadoReporte::fromArray($data);
                if($this->Bd->insertar("estados_reportes", ['estado' => $er->estado, 'descripcion' => $er->descripcion])){
                    return $this->Bd->seleccionar("estados_reportes", "1 ORDER BY id DESC LIMIT 1", "id")->fetch()['id'];
                }
        }
        return 0;
    }

    public function put($idReporte, array $data): bool {
        if(Usuario::isAdmin($_SERVER['PHP_AUTH_USER']) && $idReporte !== null && $data !== null){
            $d = $this->get($idReporte);
            if ($d != null) {
                $er = EstadoReporte::fromArray($data);
                    if($this->Bd->actualizar("estados_reportes", ['estado' => $er->estado, 'descripcion' => $er->descripcion], "id = $d->id")){
                        return true;
                    }
            }
        }
        return false;
    }

    public function delete($idReporte): bool {
        if($idReporte !== null){
            $d = $this->get($idReporte);
            if ($d != null) {
                if($d->estado == $_SERVER['PHP_AUTH_USER']){
                    throw new ForbiddenException("No se puede eliminar el estado del reporte actual.", 1);
                }
                    if($this->Bd->eliminar("estados_reportes", "estado = :e", ['e' => $d->estado])){
                        return true;
                    }
                
            }
        }
        return false;
    }
}