<?php

namespace App\Core\Exceptions;

use Exception;
use Liopoos\HttpCode\Http;
use Throwable;

class AppException extends Exception
{
    public function __construct(
        string $message = "Internal Server Error",
        int $code = Http::HTTP_INTERNAL_SERVER_ERROR,
        ?Throwable $previous = null
    ) {
        return parent::__construct($message, $code, $previous);
    }

    public static function page(
        Throwable $e,
        int $httpCode = Http::HTTP_INTERNAL_SERVER_ERROR
    ): void {
        http_response_code($httpCode);

        if (filter_var($_ENV['APP_DEBUG'], FILTER_VALIDATE_BOOLEAN)) {
            // Displaying the exception in debug mode
            echo '<b>Code:</b> ' . (string) $e->getCode() . '<br>';
            echo '<b>Message:</b> ' . $e->getMessage() . '<br>';
            echo '<b>File:</b> ' . $e->getFile() . '<br>';
            echo '<b>Line:</b> ' . $e->getLine() . '<br>';
        } else {
            // Displaying the exception in production mode
            $exceptionMessage = $e->getMessage();
            if ($exceptionMessage === '') $exceptionMessage = null;

            require __DIR__ . "/../../Views/errors/$httpCode.php";
        }
    }
}
