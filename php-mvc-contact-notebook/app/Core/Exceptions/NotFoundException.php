<?php

namespace App\Core\Exceptions;

use Liopoos\HttpCode\Http;
use Throwable;

class NotFoundException extends AppException
{
    public function __construct(
        string $message = "Resource Not Found",
        int $code = Http::HTTP_NOT_FOUND,
        ?Throwable $previous = null
    ) {
        return parent::__construct($message, $code, $previous);
    }

    public function display(): void
    {
        parent::page($this, Http::HTTP_NOT_FOUND);
    }
}
