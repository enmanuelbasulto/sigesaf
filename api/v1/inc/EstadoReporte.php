<?php

final class EstadoReporte {
    public $id = null;
    public $estado = null;
    public $descripcion = null;
    
    public function __construct(int $id = null, string $estado = null, string $descripcion = null) {
        $this->id = $id;
        $this->estado = $estado;
        $this->descripcion = $descripcion;
    }

    public static function fromArray(array $data): EstadoReporte {
        return new EstadoReporte($data['id'], $data['estado'], $data['descripcion']);
    }
}