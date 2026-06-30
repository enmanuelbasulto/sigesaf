<?php

date_default_timezone_set('America/Havana');

function addslashesRecursivo($var) {
    if (!is_array($var)) {
        return addslashes(htmlentities($var));
    }
        
    $new_var = array();
    foreach ($var as $k => $v)
        $new_var[addslashes(htmlentities($k))] = addslashesRecursivo($v);
        
    return $new_var;
}

$_GET = addslashesRecursivo($_GET);

final class index {
    private $Response = null;

    public function exception_handler($ex): void {
        if ($ex instanceof BadRequestException) {
            $this->Response->StatusCode = HTTPCodes::BAD_REQUEST;
        } else if ($ex instanceof UnauthorizedException) {
            $this->Response->StatusCode = HTTPCodes::UNAUTHORIZED;
        } else if ($ex instanceof ForbiddenException) {
            $this->Response->StatusCode = HTTPCodes::FORBIDDEN;
        } else if ($ex instanceof NotFoundException) {
            $this->Response->StatusCode = HTTPCodes::NOT_FOUND;
        } else {
            $this->Response->StatusCode = HTTPCodes::INTERNAL_SERVER_ERROR;
        }
        $this->Response->Body = array("error" => $ex->getMessage());
        exit($this->Response->send());
    }
    
    
    public function autoload_function($name, bool $pagina = false): void {
        $class = "./inc/".$name.".php";
        if($pagina){
            $class = "./public/".$name.".php";
        }
        if(!file_exists($class))
        {
            throw new NotFoundException("Class '".$name."' not found.", 1);
        }
        
        include_once $class;
    }
    
    public function cargarEP($name): void {
        $this->autoload_function($name, $pagina = true);
    }

    public function init(): void {
        error_reporting(E_ALL | E_STRICT);
        set_exception_handler(array($this, 'exception_handler'));
        spl_autoload_register(array($this, 'autoload_function'));
        
        $request = HTTPRequest::fromGlobals();
        $this->Response = new HTTPResponse($request->Protocol);

        $this->Response->ContentType = "application/json; charset=UTF-8";
        $this->Response->addHeader("Access-Control-Allow-Origin", "*");
        $this->Response->addHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE");
        $this->Response->addHeader("Access-Control-Max-Age", "3600");
        $this->Response->addHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        
        // CORS preflight channel.
        if ($request->Verb === "OPTIONS") {
            $this->Response->StatusCode = HTTPCodes::OK;
            exit($this->Response->send());
        }
        
        if (isset($_SERVER['PHP_AUTH_USER'])&&isset($_SERVER['PHP_AUTH_PW'])) {
            if (Usuario::authenticate($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'])) {
                
                $class = $request->URL[0];
                $this->cargarEP($class);
                $class = new $class(Usuario::getLocal((string)$_SERVER['PHP_AUTH_USER']));
                
                if ($request->Verb === "GET") {
                    if (count($request->URL)<2){
                        $request->URL[1] = null;
                    }
                    $d = $class->get($request->URL[1], $request->QueryString);
                    if(empty($d)){
                        throw new NotFoundException("Could NOT find the requested object.", 1);
                    }
                    $this->Response->Body = $d;
                    $this->Response->StatusCode = HTTPCodes::OK;
                } else if ($request->Verb === "POST") {
                    $rol = Usuario::getRol($_SERVER['PHP_AUTH_USER']);
                    $puedePost = ($rol === 'administrador') || 
                        (($rol === 'tecnico') && in_array($request->URL[0], ["prestamos", "reportes"]));
                    if($puedePost){
                        $d = $class->post((array) json_decode($request->Body));
                        if($d < 1){
                            throw new Exception("Could NOT insert the requested object.", 1);
                        }
                        $this->Response->Body = array('url' => "/".$request->URL[0]."/".$d);
                        $this->Response->Location = $this->Response->Body['url'];
                        $this->Response->StatusCode = HTTPCodes::CREATED;
                    } else {
                        throw new ForbiddenException("No tienes permisos para realizar esta acción.", 1);
                    }
                } else if ($request->Verb === "PUT") {
                    $rol = Usuario::getRol($_SERVER['PHP_AUTH_USER']);
                    if($rol !== 'consulta'){
                        $d = $class->put($request->URL[1], (array) json_decode($request->Body));
                        if(empty($d)){
                            throw new NotFoundException("Could NOT find the requested object.", 1);
                        }
                        $this->Response->Body = null;
                        $this->Response->StatusCode = HTTPCodes::NO_CONTENT;
                    } else {
                        throw new ForbiddenException("No tienes permisos para modificar datos.", 1);
                    }
                }else {
                    $rol = Usuario::getRol($_SERVER['PHP_AUTH_USER']);
                    if($rol === 'administrador'){
                        switch ($request->Verb) {
                            case 'DELETE':
                                if(!$class->delete($request->URL[1])){
                                    throw new NotFoundException("Could NOT find the requested object.", 1);
                                }
                                $this->Response->Body = null;
                                $this->Response->StatusCode = HTTPCodes::NO_CONTENT;
                                break;
                            default:
                                throw new BadRequestException("Method not supported", 1);
                                break;
                        }
                    } else {
                        throw new ForbiddenException("Para realizar la acción solicitada, se requieren privilegios administrativos.", 1);
                    }
                }

                exit($this->Response->send());
            }
        }
        //$this->Response->addHeader("WWW-Authenticate", "Basic realm=\"Sigesaf API\"");
        //$this->Response->send();
        throw new UnauthorizedException("Usuario y/o clave de acceso incorrectos.", 1);
    }
}

$index = new index();
$index->init();
