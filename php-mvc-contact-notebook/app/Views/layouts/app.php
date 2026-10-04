<?php

/** @var string $description */
/** @var string $title */
/** @var string $view */
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?= htmlspecialchars($description) ?>">
    <title><?= htmlspecialchars($title) ?></title>

    <!-- CSS files -->
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />
    <link rel="stylesheet" href="http://localhost:8000/assets/css/style.css" />
</head>

<body>
    <div class="wrapper">
        <?php require __DIR__ . '/../partials/header.php'; ?>

        <main>
            <?= $view ?>
        </main>

        <?php require __DIR__ . '/../partials/footer.php'; ?>

        <!-- JavaScript files -->
        <script src="http://localhost:8000/assets/js/main.js"></script>
    </div>
</body>

</html>