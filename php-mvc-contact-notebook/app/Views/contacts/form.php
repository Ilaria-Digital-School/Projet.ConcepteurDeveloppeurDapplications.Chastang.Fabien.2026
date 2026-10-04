<?php

/** @var \App\Models\Contact $contact */
/** @var int $titleForm */
/** @var int $buttonSave */
/** @var string $name */
/** @var string $email */
/** @var string $phone */
$alertClass = "inline-block";
?>

<section class="center">
    <div class="d-flex justify-content-end">
        <a href="/contacts" class="bolder">Return</a>
    </div>

    <!-- Alert message: success/error -->
    <?php require __DIR__ . '/alert.php'; ?>

    <!--Registration/Modification form -->
    <form class="form" action="/contacts/update" method="POST">
        <?php if (isset($id)) { ?>
            <input type="hidden" name="id" value="<?= $id ?>">
        <?php } ?>
        <h2><?= $titleForm ?></h2>

        <fieldset>
            <legend>Mandatory information</legend>
            <div>
                <label for="userName">Name:</label>
                <input
                    type="text"
                    class="<?= isset($_SESSION["errors"]["userName"]) ? 'form-control is-invalid' : '' ?>"
                    name="userName"
                    id="userName"
                    placeholder="Contact name"
                    value="<?= htmlspecialchars($_SESSION["values"]["userName"] ?? $name) ?>" />
                <?php if (isset($_SESSION["errors"]["userName"])) { ?>
                    <div class="error"><?= htmlspecialchars($_SESSION["errors"]["userName"]) ?></div>
                <?php } ?>
            </div>
            <div>
                <label for="userEmail">Email:</label>
                <input
                    type="text"
                    class="<?= isset($_SESSION["errors"]["userEmail"]) ? 'form-control is-invalid' : '' ?>"
                    name="userEmail"
                    id="userEmail"
                    placeholder="email@address.xyz"
                    value="<?= htmlspecialchars($_SESSION["values"]["userEmail"] ?? $email) ?>" />
                <?php if (isset($_SESSION["errors"]["userEmail"])) { ?>
                    <div class="error"><?= htmlspecialchars($_SESSION["errors"]["userEmail"]) ?></div>
                <?php } ?>
            </div>
            <div>
                <label for="userPhone">Phone:</label>
                <input
                    type="text"
                    class="<?= isset($_SESSION["errors"]["userPhone"]) ? 'form-control is-invalid' : '' ?>"
                    name="userPhone"
                    id="userPhone"
                    placeholder="01 23 45 67 89"
                    value="<?= htmlspecialchars($_SESSION["values"]["userPhone"] ?? $phone) ?>" />
                <?php if (isset($_SESSION["errors"]["userPhone"])) { ?>
                    <div class="error"><?= htmlspecialchars($_SESSION["errors"]["userPhone"]) ?></div>
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