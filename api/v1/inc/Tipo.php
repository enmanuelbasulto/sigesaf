<?php

final class Tipo {
    public $id = null;
    public $tipo = null;
    public $descripcion = null;
    
    public function __construct(int $id = null, string $tipo = null, string $descripcion = null) {
        $this->id = $id;
        $this->tipo = $tipo;
        $this->descripcion = $descripcion;
    }

    public static function fromArray(array $data): Tipo {
        return new Tipo($data['id'], $data['tipo'], $data['descripcion']);
    }
}