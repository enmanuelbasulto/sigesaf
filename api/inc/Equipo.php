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
    public $modelo = null;
    public $numero_serie = null;
    public $fecha_compra = null;
    public $garantia = null;
    public $responsable = null;
    public $codigo_qr = null;



    public function __construct(int $id = null, int $id_local = 0, string $local = null, int $no_inv = 0, string $observaciones = null, int $id_marca = 0, string $marca = null, int $id_tipo = 0, string $tipo = null, int $id_estado = 0, string $estado = null, string $sello = null, string $modelo = null, string $numero_serie = null, string $fecha_compra = null, int $garantia = null, string $responsable = null, string $codigo_qr = null) {
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
        $this->modelo = $modelo;
        $this->numero_serie = $numero_serie;
        $this->fecha_compra = $fecha_compra;
        $this->garantia = $garantia;
        $this->responsable = $responsable;
        $this->codigo_qr = $codigo_qr;
    }

    public static function fromArray(array $data): Equipo {
        return new Equipo($data['id'] ?? null, $data['id_local'] ?? 0, $data['local'] ?? null, $data['no_inv'] ?? 0, $data['observaciones'] ?? null, $data['id_marca'] ?? 0, $data['marca'] ?? null, $data['id_tipo'] ?? 0, $data['tipo'] ?? null, $data['id_estado'] ?? 0, $data['estado'] ?? null, $data['sello'] ?? null, $data['modelo'] ?? null, $data['numero_serie'] ?? null, $data['fecha_compra'] ?? null, $data['garantia'] ?? null, $data['responsable'] ?? null, $data['codigo_qr'] ?? null);
    }

    public static function getLocal(int $id): int {
        $bd = new Bd(); 
        return (int)$bd->seleccionar("equipos", "id = :id", "id_local", ['id' => $id])->fetch()['id_local'];
    }
}