<?php

final class estadosPrestamos {
    private $Bd;
    private $Raiz = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
    }

    public function get($idPrestamo = null, $params = null) {
        $ep = array();
        if($idPrestamo != null) {
            if(is_numeric($idPrestamo)){
                $d = $this->Bd->seleccionar("estados_prestamos", "id = $idPrestamo")->fetch();
            }
            if ($d != null) {
                $ep = EstadoPrestamo::fromArray($d);
                
                return $ep;
            }
            return null;
        }
        $d = $this->Bd->seleccionar("estados_prestamos")->fetchAll();
        if ($d != null) {
            foreach ($d as $key => $value) {
                $ep[count($ep)] = EstadoPrestamo::fromArray($value);
            }
        }
        return $ep;
    }
//terminar aqui
    public function post(array $data): int {
        if($data !== null){
            $ep = EstadoPrestamo::fromArray($data);
                if($this->Bd->insertar("estados_prestamos", ['estado' => $ep->estado, 'descripcion' => $ep->descripcion])){
                    return $this->Bd->seleccionar("estados_prestamos", "1 ORDER BY id DESC LIMIT 1", "id")->fetch()['id'];
                }
        }
        return 0;
    }

    public function put($idPrestamo, array $data): bool {
        if(Usuario::isAdmin($_SERVER['PHP_AUTH_USER']) && $idPrestamo !== null && $data !== null){
            $d = $this->get($idPrestamo);
            if ($d != null) {
                $ep = EstadoPrestamo::fromArray($data);
                    if($this->Bd->actualizar("estados_prestamos", ['estado' => $ep->estado, 'descripcion' => $ep->descripcion], "id = $d->id")){
                        return true;
                    }
            }
        }
        return false;
    }

    public function delete($idPrestamo): bool {
        if($idPrestamo !== null){
            $d = $this->get($idPrestamo);
            if ($d != null) {
                if($d->estado == $_SERVER['PHP_AUTH_USER']){
                    throw new ForbiddenException("No se puede eliminar el estado del reporte actual.", 1);
                }
                    if($this->Bd->eliminar("estados_prestamos", "estado = :e", ['e' => $d->estado])){
                        return true;
                    }
                
            }
        }
        return false;
    }
}