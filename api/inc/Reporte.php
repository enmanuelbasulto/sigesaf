<?php

final class Reporte {
    public $id = null;
    public $fecha = null;
    public $problema= null;
    public $id_usuario = 0;
    public $id_equipo = 0;
    public $id_estado = 0;
    public $usuario= null;
    public $equipo= null;
    public $local= null;
    public $marca= null;
    public $tipo= null;
    public $estado= null;
    
    public function __construct(int $id = null, DateTime $fecha = null, string $problema = null, int $id_usuario = 0, int $id_equipo = 0, int $id_estado = 0, string $usuario = null, string $equipo = null, string $local = null, string $marca = null, string $tipo = null, string $estado = null) {
        $this->id = $id;
        $this->fecha = $fecha;
        $this->problema = $problema;
        $this->id_usuario = $id_usuario;
        $this->id_equipo = $id_equipo;
        $this->id_estado = $id_estado;
        $this->usuario = $usuario;
        $this->equipo = $equipo;
        $this->local = $local;
        $this->marca = $marca;
        $this->tipo = $tipo;
        $this->estado = $estado;
    }

    public static function fromArray(array $data): Reporte {
        $fecha = new DateTime($data['fecha']);
        return new Reporte($data['id'], $fecha, $data['problema'], (int)$data['id_usuario'], (int)$data['id_equipo'], (int)$data['id_estado'], $data['usuario'], $data['equipo'], $data['local'], $data['marca'], $data['tipo'], $data['estado']);
    }

    public static function getLocal(int $id): int {
        $bd = new Bd();
        $id_equipo = $bd->seleccionar("reportes", "id = '$id'", "id_equipo")->fetch()['id_equipo'];
        return Equipo::getLocal($id_equipo);
    }
}