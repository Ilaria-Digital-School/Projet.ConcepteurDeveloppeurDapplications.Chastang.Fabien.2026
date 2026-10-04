<?php

/** @var string $alertClass */
?>

<?php if (isset($_SESSION['alert'])) { ?>
    <div class="alert alert-<?= $_SESSION['alert']['type'] ?> <?= $alertClass ?>" role="alert">
        <?= htmlspecialchars($_SESSION['alert']['message']) ?>
    </div>
<?php } ?>