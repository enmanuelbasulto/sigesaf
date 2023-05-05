<?php

final class EstadoEquipo {
    public $id = null;
    public $estado = null;
    public $descripcion = null;
    
    public function __construct(int $id = null, string $estado = null, string $descripcion = null) {
        $this->id = $id;
        $this->estado = $estado;
        $this->descripcion = $descripcion;
    }

    public static function fromArray(array $data): EstadoEquipo {
        return new EstadoEquipo($data['id'], $data['estado'], $data['descripcion']);
    }
}