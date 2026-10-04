<?php

namespace App\Core\Exceptions;

use Throwable;

class DatabaseException extends AppException
{
    public function __construct(string $message = "", int $code = 0, ?Throwable $previous = null)
    {
        return parent::__construct($message, $code, $previous);
    }

    public function display(): void
    {
        parent::displayInfo(500);
    }
}
