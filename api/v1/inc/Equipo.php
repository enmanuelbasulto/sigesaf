<?php

final class Equipo {
    public $id = null;
    public $id_local = 0;
    public $local = null;
    public $no_inv= 0;
    public $observaciones= null;
    public $id_marca = 0;
    public $marca = null;
    public $id_tipo = 0;
    public $tipo = null;
    public $id_estado = 0;
    public $estado = null;
    public $sello = null;
    
    
    
    public function __construct(int $id = null, int $id_local = 0, string $local = null, int $no_inv = 0, string $observaciones = null, int $id_marca = 0, string $marca = null, int $id_tipo = 0, string $tipo = null, int $id_estado = 0, string $estado = null, int $sello = null) {
        $this->id = $id;
        $this->id_local = $id_local;
        $this->local = $local;
        $this->no_inv = $no_inv;
        $this->observaciones = $observaciones;
        $this->id_marca = $id_marca;
        $this->marca = $marca;
        $this->id_tipo = $id_tipo;
        $this->tipo = $tipo;
        $this->id_estado = $id_estado;
        $this->estado = $estado;
        $this->sello = $sello;
    }

    public static function fromArray(array $data): Equipo {
        return new Equipo($data['id'], $data['id_local'], $data['local'], $data['no_inv'], $data['observaciones'], $data['id_marca'], $data['marca'], $data['id_tipo'], $data['tipo'], $data['id_estado'], $data['estado'], $data['sello']);
    }

    public static function getLocal(int $id): int {
        $bd = new Bd(); 
        return (int)$bd->seleccionar("equipos", "id = '$id'", "id_local")->fetch()['id_local'];
    }
}