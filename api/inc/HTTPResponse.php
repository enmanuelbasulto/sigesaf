<?php

final class HTTPResponse {
    public $Protocol = null;
    public $StatusCode = HTTPCodes::NO_CONTENT;
    public $Location = null;
    public $ContentType = null;
    public $Body = null;
    public $Headers = null;
    
    public function __construct(string $protocol = "HTTP/1.1") {
        $this->Protocol = $protocol;
    }

    public function addHeader(string $name, string $value): void {
        if ($this->Headers === null) {
            $this->Headers = array();
        }
        $this->Headers[$name] = $value;
    }

    public function send(): void {
        header($this->Protocol." ".$this->StatusCode);
        if ($this->Headers !== null) {
            foreach ($this->Headers as $header => $val) {
                header($header.": ".$val);
            }
        }
        if ($this->ContentType !== null) {
            header("Content-Type: ".$this->ContentType);
        }
        if ($this->Body !== null) {
            print(json_encode($this->Body));
        }
    }
}