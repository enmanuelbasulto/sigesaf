<?php

class Config {
    
    private static $datos = null;
    private static $archivo = 'config.ini';

    private static function obtDatos() {
        if (self::$datos != null) {
            return self::$datos;
        }
        
        $paths = [
            __DIR__ . '/' . self::$archivo,
            self::$archivo,
        ];
        foreach ($paths as $path) {
            if (file_exists($path)) {
                self::$datos = parse_ini_file($path, true);
                return self::$datos;
            }
        }
        throw new Exception("CONFIG: No se encontró el archivo de configuración.");
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