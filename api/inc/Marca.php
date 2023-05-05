<?php

final class Marca {
    public $id = null;
    public $marca = null;
    
    public function __construct(int $id = null, string $marca = null) {
        $this->id = $id;
        $this->marca = $marca;
    }

    public static function fromArray(array $data): Marca {
        return new Marca($data['id'], $data['marca']);
    }
}