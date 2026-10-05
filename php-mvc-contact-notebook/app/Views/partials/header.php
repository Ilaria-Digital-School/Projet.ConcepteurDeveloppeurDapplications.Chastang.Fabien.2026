<?php

$appDebug = filter_var($_ENV['APP_DEBUG'], FILTER_VALIDATE_BOOLEAN);
?>

<header>
    <h1>
        Contact Notebook
        <?php if ($appDebug) { ?>
            <span id="dev">Dev</span>
        <?php } ?>
    </h1>
</header>