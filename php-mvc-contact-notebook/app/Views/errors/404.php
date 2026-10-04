<?php

$statusCode = 404;
$statusMessage = $exceptionMessage ?? "Resource Not Found";
$additionalMessage = "We can't seem to find the resource you're looking for.";

require __DIR__ . '/error.php';
