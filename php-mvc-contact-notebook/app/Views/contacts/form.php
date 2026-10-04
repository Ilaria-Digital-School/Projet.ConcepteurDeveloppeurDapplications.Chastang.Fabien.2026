<?php

/** @var int $titleForm */
/** @var int $buttonSave */
/** @var string $action */
/** @var string $name */
/** @var string $email */
/** @var string $phone */

$alertClass = "inline-block";
$errName = htmlspecialchars($_SESSION["errors"]["userName"] ?? "");
$errEmail = htmlspecialchars($_SESSION["errors"]["userEmail"] ?? "");
$errPhone = htmlspecialchars($_SESSION["errors"]["userPhone"] ?? "");
?>

<section class="center">
    <div class="d-flex justify-content-end">
        <a href="/contacts" class="bolder">Return</a>
    </div>

    <!-- Alert message: success/error -->
    <?php require __DIR__ . '/alert.php'; ?>

    <!--Registration/Modification form -->
    <form class="form" action="/contacts/<?= $action ?>" method="POST">
        <?php if (isset($id) && $id > 0) { ?>
            <input type="hidden" name="id" value="<?= $id ?>">
        <?php } ?>
        <h2><?= $titleForm ?></h2>

        <fieldset>
            <legend>Mandatory information</legend>
            <div>
                <label for="userName">Name:</label>
                <input
                    type="text"
                    class="<?= $errName !== "" ? 'form-control is-invalid' : '' ?>"
                    name="userName"
                    id="userName"
                    placeholder="Contact name"
                    value="<?= $name ?>" />
                <?php if ($errName !== "") { ?>
                    <div class="error"><?= $errName ?></div>
                <?php } ?>
            </div>
            <div>
                <label for="userEmail">Email:</label>
                <input
                    type="text"
                    class="<?= $errEmail !== "" ? 'form-control is-invalid' : '' ?>"
                    name="userEmail"
                    id="userEmail"
                    placeholder="email@address.xyz"
                    value="<?= $email ?>" />
                <?php if ($errEmail !== "") { ?>
                    <div class="error"><?= $errEmail ?></div>
                <?php } ?>
            </div>
            <div>
                <label for="userPhone">Phone:</label>
                <input
                    type="text"
                    class="<?= $errPhone !== "" ? 'form-control is-invalid' : '' ?>"
                    name="userPhone"
                    id="userPhone"
                    placeholder="01 23 45 67 89"
                    value="<?= $phone ?>" />
                <?php if ($errPhone !== "") { ?>
                    <div class="error"><?= $errPhone ?></div>
                <?php } ?>
            </div>
        </fieldset>

        <div class="div-button">
            <button type="submit"><?= $buttonSave ?></button>
            <button type="reset" title="Cancel the changes" aria-label="Cancel the changes">
                <i class="fa-solid fa-eraser"></i>
            </button>
        </div>
    </form>
</section>

<!-- Delete flash messages -->
<?php unset($_SESSION['alert'], $_SESSION["errors"], $_SESSION["values"]); ?>