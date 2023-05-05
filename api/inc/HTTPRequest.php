<?php

final class HTTPRequest {
    public $Verb = null;
    public $URL = '/';
    public $QueryString = null;
    public $Body = null;
    public $Protocol = null;
    
    public static function fromGlobals(): HTTPRequest {
        $r = new HTTPRequest();
        $r->Verb = strtoupper(filter_input(INPUT_SERVER, 'REQUEST_METHOD'));
        $r->QueryString = str_ireplace("&", "&&", str_ireplace("%22", "\"", filter_input(INPUT_SERVER, 'QUERY_STRING')));
        $url = explode('?', filter_input(INPUT_SERVER, 'REQUEST_URI'))[0];
        $script_name = filter_input(INPUT_SERVER, 'SCRIPT_NAME');
        $aurl1 = explode('/', trim($url, '/'));
        for ($i=0,$j=0; $i < count($aurl1); $i++) { 
            if ($aurl1[$i] !== "") {
                $aurl[$j] = $aurl1[$i];
                $j++;
            }
        }
        $ascript_name = explode('/', trim($script_name, '/'));
        $num = count($ascript_name);
        for ($i=0; $i < count($ascript_name); $i++) { 
            if(($aurl[$i] != $ascript_name[$i]))
            {
                $num = $i;
                break;
            }
            continue;
        }
        for ($i=$num; $i < count($aurl); $i++) {
            if($aurl[$i] !== ""){
                $r->URL = $r->URL.$aurl[$i].'/';
            }
        }
        $r->URL = explode('/', trim($r->URL, '/'));
        $r->Body = file_get_contents('php://input');
        $r->Protocol = filter_input(INPUT_SERVER, 'SERVER_PROTOCOL');
        return $r;
    }
}