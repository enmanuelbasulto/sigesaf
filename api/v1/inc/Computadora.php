<?php

final class Computadora {
    public $id = null;
    public $id_local = 0;
    public $id_pc = 0;
    public $id_monitor = null;
    public $id_teclado = null;
    public $id_mouse = null;
    public $id_speaker = null;
    public $id_ups = null;
    public $nombre = null;
    
    public function __construct(int $id = null, int $id_local = 0, int $id_pc = 0, int $id_monitor = null, int $id_teclado = null, int $id_mouse = null, int $id_speaker = null, int $id_ups = null, string $nombre = null) {
        $this->id = $id;
        $this->id_local = $id_local;
        $this->id_pc = $id_pc;
        $this->id_monitor = $id_monitor;
        $this->id_teclado = $id_teclado;
        $this->id_mouse = $id_mouse;
        $this->id_speaker = $id_speaker;
        $this->id_ups = $id_ups;
        $this->nombre = $nombre;
    }

    public static function fromArray(array $data): Computadora {
        return new Computadora($data['id'], $data['id_local'], $data['id_pc'], $data['id_monitor'], $data['id_teclado'], $data['id_mouse'], $data['id_speaker'], $data['id_ups'], $data['nombre']);
    }

    public static function getLocal(int $id): int {
        $bd = new Bd();
        return $bd->seleccionar("computadoras", "id = $id", "id_local")->fetch()['id_local'];
    }
}