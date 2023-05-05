<?php

class Config {
    
    private static $datos = null;
    private static $archivo = 'config.ini';

    private static function obtDatos() {
        if (self::$datos != null) {
            return self::$datos;
        }
        
        self::$datos = parse_ini_file(self::$archivo, true);
        return self::$datos;
    }

    public static function obtConfig($param = null) {
        
        if($param == null) {
            return self::obtDatos();
        }
        
        $datos = self::obtDatos();
        if(!array_key_exists($param, $datos)) {
            throw new Exception("CONFIG: El valor de $param no está definido en la configuración.");
        }
        
        return $datos[$param];
    }
}