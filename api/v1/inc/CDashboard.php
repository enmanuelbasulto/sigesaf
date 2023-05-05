<?php

final class CDashboard {
    public $cantidadTV = 0;
    public $totalCantidadTV = 0;
    public $cantidadComputadoras = 0;
    public $totalCantidadComputadoras = 0;
    public $cantidadReportes = 0;
    public $cantidadPrestamosHechos = 0;
    public $cantidadPrestamosRecibidos = 0;
    public $cantidadPC = 0;
    public $totalCantidadPC = 0;
    public $cantidadClientesLigeros = 0;
    public $totalCantidadClientesLigeros = 0;
    public $cantidadServidores = 0;
    public $totalCantidadServidores = 0;
    
    public function __construct(int $cantidadTV = 0, int $totalCantidadTV = 0, int $cantidadComputadoras = 0, int $totalCantidadComputadoras = 0, int $cantidadReportes = 0, int $cantidadPrestamosHechos = 0, int $cantidadPrestamosRecibidos = 0, int $cantidadPC = 0, int $totalCantidadPC = 0, int $cantidadClientesLigeros = 0, int $totalCantidadClientesLigeros = 0, int $cantidadServidores = 0, int $totalCantidadServidores = 0) {
        $this->cantidadTV = $cantidadTV;
        $this->totalCantidadTV = $totalCantidadTV;
        $this->cantidadComputadoras = $cantidadComputadoras;
        $this->totalCantidadComputadoras = $totalCantidadComputadoras;
        $this->cantidadReportes = $cantidadReportes;
        $this->cantidadPrestamosHechos = $cantidadPrestamosHechos;
        $this->cantidadPrestamosRecibidos = $cantidadPrestamosRecibidos;
        $this->cantidadPC = $cantidadPC;
        $this->totalCantidadPC = $totalCantidadPC;
        $this->cantidadClientesLigeros = $cantidadClientesLigeros;
        $this->totalCantidadClientesLigeros = $totalCantidadClientesLigeros;
        $this->cantidadServidores = $cantidadServidores;
        $this->totalCantidadServidores = $totalCantidadServidores;
    }

    public static function fromArray(array $data): CDashboard {
        return new CDashboard($data['cantidadTV'], $data['totalCantidadTV'], $data['cantidadComputadoras'], $data['totalCantidadComputadoras'], $data['cantidadReportes'], $data['cantidadPrestamosHechos'], $data['cantidadPrestamosRecibidos'], $data['cantidadPC'], $data['totalCantidadPC'], $data['cantidadClientesLigeros'], $data['totalCantidadClientesLigeros'], $data['cantidadServidores'], $data['totalCantidadServidores']);
    }
}