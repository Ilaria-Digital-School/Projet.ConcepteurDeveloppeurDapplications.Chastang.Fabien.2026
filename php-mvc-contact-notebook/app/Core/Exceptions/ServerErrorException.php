<?php

namespace App\Core\Exceptions;

use Throwable;

class ServerErrorException extends AppException
{
    public function __construct(
        string $message = "Internal Server Error",
        int $code = 0,
        ?Throwable $previous = null
    ) {
        return parent::__construct($message, $code, $previous);
    }

    public function display(): void
    {
        parent::page($this, 500);
    }
}
