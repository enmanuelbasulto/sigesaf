<?php

final class Prestamo {
    public $id = null;
    public $fecha = null;
    public $fecha_fin = null;
    public $motivo= null;
    public $recibe= null;
    public $local_req= null;
    public $id_equipo = 0;
    public $id_local_dest = null;
    public $id_estado = 0;
    public $id_usuario_req = 0;
    public $id_usuario_aut = null;
    public $usuario_req = null;
    public $equipo = null;
    public $local = null;
    public $marca = null;
    public $tipo = null;
    public $estado = null;
    public $local_destino = null;
    public $autoriza = null;
    
    public function __construct(int $id = null, DateTime $fecha = null, DateTime $fecha_fin = null, string $motivo = null, string $recibe = null, string $local_req = null, int $id_equipo = 0, $id_local_dest = null, int $id_estado = 1, int $id_usuario_req = 0, int $id_usuario_aut = null, string $usuario_req = null, string $equipo = null, string $local = null, string $marca = null, string $tipo = null, string $estado = null, string $local_destino = null, string $autoriza = null) {
        $this->id = $id;
        $this->fecha = $fecha;
        $this->fecha_fin = $fecha_fin;
        $this->motivo= $motivo;
        $this->recibe= $recibe;
        $this->local_req= $local_req;
        $this->id_equipo = $id_equipo;
        $this->id_local_dest = $id_local_dest;
        $this->id_estado = $id_estado;
        $this->id_usuario_req = $id_usuario_req;
        $this->id_usuario_aut = $id_usuario_aut;
        $this->usuario_req = $usuario_req;
        $this->equipo = $equipo;
        $this->local = $local;
        $this->marca = $marca;
        $this->tipo = $tipo;
        $this->estado = $estado;
        $this->local_destino = $local_destino;
        $this->autoriza = $autoriza;
    }
    
    public static function fromArray(array $data): Prestamo {
        $fecha = new DateTime($data['fecha']);
        $fecha_fin = new DateTime($data['fecha_fin']);
        return new Prestamo($data['id'], $fecha, $fecha_fin, $data['motivo'], $data['recibe'], $data['local_req'], (int)$data['id_equipo'], $data['id_local_dest'], ($data['id_estado'] != null ? $data['id_estado'] : 1), ($data['id_usuario_req'] != null ? $data['id_usuario_req'] : 0), $data['id_usuario_aut'], $data['usuario_req'], $data['equipo'], $data['local'], $data['marca'], $data['tipo'], $data['estado'], $data['local_destino'], $data['autoriza']);
    }

    public static function getLocal(int $id): int {
        $bd = new Bd();
        $id_equipo = $bd->seleccionar("prestamos", "id = '$id'", "id_equipo")->fetch()['id_equipo'];
        return Equipo::getLocal($id_equipo);
    }

    public static function getLocalDest(int $id): int {
        $bd = new Bd();
        return $bd->seleccionar("prestamos", "id = '$id'", "id_local_dest")->fetch()['id_local_dest'];
    }
}