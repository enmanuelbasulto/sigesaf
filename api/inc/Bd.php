<?php

class Bd{
    
    private $pdo;
    
    public function __construct() {
        if (!isset($this->pdo)) {
            $config = Config::obtConfig('bd');
            $this->pdo = new PDO($config['dsn'], $config['usuario'], $config['clave']);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->pdo->exec('set session sql_mode = traditional');
            $this->pdo->exec('set session innodb_strict_mode = on');
        }
    }
    
    public function ejecutar($consulta, array $params = null) {
        if(empty($consulta)) {
            throw new Exception("BD: No se puede ejecutar una consulta vacía.");
        }
        $r = $this->pdo->prepare($consulta);
        $r->execute($params);
        
        return $r;
    }
    
    public function crearTabla($nombre, $campos) {
        if(empty($nombre)||empty($campos)) {
            throw new Exception("BD: Debe especificar el nombre de la tabla y los campos necesarios.");
        }
        
        return $this->ejecutar("CREATE TABLE IF NOT EXISTS $nombre ($campos);");
    }
    
    public function eliminarTabla($nombre) {
        if(empty($nombre)) {
            throw new Exception("BD: Debe especificar el nombre de la tabla a eliminar.");
        }
        
        return $this->ejecutar("DROP TABLE $nombre;");
    }
    
    public function vaciarTabla($nombre) {
        if(empty($nombre)) {
            throw new Exception("BD: Debe especificar el nombre de la tabla a vaciar.");
        }
        
        return $this->ejecutar("TRUNCATE TABLE $nombre;");
    }
    
    public function seleccionar($tabla, $condicion = '1', $campos = '*', array $params = null) {
        if(empty($tabla)) {
            throw new Exception("BD: Debe especificar el nombre de la tabla en la que buscarán los datos.");
        }
        
        return $this->ejecutar("SELECT $campos FROM $tabla WHERE $condicion;", $params);
    }

    public function insertar($tabla, array $datos) {
        if(empty($tabla) || empty($datos)) {
            throw new Exception("BD: Debe especificar el nombre de la tabla y los datos a insertar.");
        }

        $campos = implode(', ', array_keys($datos));
        $holders = ':' . implode(', :', array_keys($datos));
        return $this->ejecutar("INSERT INTO $tabla ($campos) VALUES ($holders);", $datos);
    }

    public function actualizar($tabla, array $datos, $condicion = '1') {
        if(empty($tabla) || empty($datos)) {
            throw new Exception("BD: Debe especificar el nombre de la tabla y los datos a actualizar.");
        }
        
        $sets = [];
        $params = [];
        foreach ($datos as $campo => $valor) {
            $ph = ":{$campo}";
            $sets[] = "$campo = $ph";
            $params[$campo] = $valor;
        }
        return $this->ejecutar("UPDATE $tabla SET " . implode(', ', $sets) . " WHERE $condicion;", $params);
    }
    
    public function eliminar($tabla, $condicion = '1', array $params = null) {
        if(empty($tabla)) {
            throw new Exception("BD: Debe especificar el nombre de la tabla en la que se van a eliminar los valores.");
        }
        
        return $this->ejecutar("DELETE FROM $tabla WHERE $condicion;", $params);
    }
    
    public function contarRegistros($tabla, $condicion = '1', array $params = null) {
        if(empty($tabla)) {
            throw new Exception("BD: Debe especificar el nombre de la tabla en la que se contarán los registros.");
        }
        
        $datos = $this->seleccionar($tabla, $condicion, "count(id) as cant", $params);
        return $datos->fetch()['cant'];
    }

    public function __destruct() {
        $this->pdo = null;
    }
}
