<?php

/** @var int $statusCode */
/** @var string $statusMessage */
/** @var string $additionalMessage */
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="http://localhost:8000/assets/css/style.css" />
</head>

<body>
    <div class="wrapper">
        <div class="error-page d-flex align-items-center justify-content-center">
            <div class="error-container text-center p-4">
                <h1 class="error-code mb-0"><?= (string)$statusCode ?></h1>
                <h2 class="display-6 error-message mb-3"><?= $statusMessage ?></h2>
                <p class="lead error-message mb-5"><?= $additionalMessage ?></p>
                <div class="d-flex justify-content-center gap-3">
                    <a href="/" class="btn btn-glass px-4 py-2">Return Home</a>
                </div>
            </div>
        </div>
    </div>
</body>

</html>