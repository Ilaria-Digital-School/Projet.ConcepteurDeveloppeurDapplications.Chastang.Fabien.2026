<?php

namespace App\Core\Exceptions;

use Exception;
use Throwable;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/../../../");
$dotenv->load();

class AppException extends Exception
{
    public function __construct(string $message = "", int $code = 0, ?Throwable $previous = null)
    {
        return parent::__construct($message, $code, $previous);
    }

    public function displayInfo(int $statusCode): void
    {
        http_response_code($statusCode);

        if (filter_var($_ENV['APP_DEBUG'], FILTER_VALIDATE_BOOLEAN)) {
            // Displaying the exception in debug mode
            echo '<b>Code:</b> ' . (string)$this->getCode() . '<br>';
            echo '<b>Message:</b> ' . $this->getMessage() . '<br>';
            echo '<b>File:</b> ' . $this->getFile() . '<br>';
            echo '<b>Line:</b> ' . $this->getLine() . '<br>';
        } else {
            // Displaying the exception in production mode
            $exceptionMessage = $this->getMessage();
            if ($exceptionMessage === '') $exceptionMessage = null;
            require __DIR__ . "/../../Views/errors/$statusCode.php";
        }
    }
}
