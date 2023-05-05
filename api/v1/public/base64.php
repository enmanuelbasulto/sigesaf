<?php

final class base64 {
    private $Bd;
    private $Raiz = null;

    public function __construct(string $raiz) {
        $this->Bd = new Bd();
        $this->Raiz = $raiz;
    }

    public function get($a = null, $params = null) {
        return base64_encode($a);
    }

    public function post(array $data): int {
        return 0;
    }

    public function put($a, array $data): bool {
        return false;
    }

    public function delete($a): bool {
        return false;
    }
}