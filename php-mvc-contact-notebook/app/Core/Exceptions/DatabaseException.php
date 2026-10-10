<?php

namespace App\Core\Exceptions;

use Liopoos\HttpCode\Http;
use Throwable;

class DatabaseException extends AppException
{
    public function __construct(
        string $message = "Internal Server Error",
        int $code = Http::HTTP_INTERNAL_SERVER_ERROR,
        ?Throwable $previous = null
    ) {
        return parent::__construct($message, $code, $previous);
    }

    public function display(): void
    {
        parent::page($this, Http::HTTP_INTERNAL_SERVER_ERROR);
    }
}
