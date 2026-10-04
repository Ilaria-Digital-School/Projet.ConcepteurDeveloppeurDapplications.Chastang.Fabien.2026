<?php

$statusCode = 500;
$statusMessage = $exceptionMessage ?? "Internal Server Error";
$additionalMessage = "Something went wrong on our end.";

require __DIR__ . '/error.php';
