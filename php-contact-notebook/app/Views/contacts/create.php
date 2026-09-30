<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Page containing the contact registration form">
    <title>Save contact</title>

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
        <header>
            <h1>Contact Notebook</h1>
        </header>

        <main>
            <section class="center">
                <div class="d-flex justify-content-end">
                    <a href="/contacts" class="bolder">Return</a>
                </div>

                <?php if (isset($_SESSION['alert'])) { ?>
                    <div class="alert alert-<?= $_SESSION['alert']['type'] ?> inline-block" role="alert">
                        <?= htmlspecialchars($_SESSION['alert']['message']) ?>
                    </div>
                <?php } ?>

                <!--Registration form -->
                <form class="form" action="/contacts/create" method="POST">
                    <h2>Registration</h2>

                    <fieldset>
                        <legend>Mandatory information</legend>
                        <div>
                            <label for="userName">Name:</label>
                            <input
                                type="text"
                                class="<?= isset($_SESSION["errors"]["name"]) ? 'form-control is-invalid' : '' ?>"
                                name="userName"
                                id="userName"
                                placeholder="Contact name"
                                value="<?= htmlspecialchars($_SESSION["values"]["name"] ?? "") ?>" />
                            <?php if (isset($_SESSION["errors"]["name"])) { ?>
                                <div class="error"><?= htmlspecialchars($_SESSION["errors"]["name"]) ?></div>
                            <?php } ?>
                        </div>
                        <div>
                            <label for="userEmail">Email:</label>
                            <input
                                type="text"
                                class="<?= isset($_SESSION["errors"]["email"]) ? 'form-control is-invalid' : '' ?>"
                                name="userEmail"
                                id="userEmail"
                                placeholder="email@address.xyz"
                                value="<?= htmlspecialchars($_SESSION["values"]["email"] ?? "") ?>" />
                            <?php if (isset($_SESSION["errors"]["email"])) { ?>
                                <div class="error"><?= htmlspecialchars($_SESSION["errors"]["email"]) ?></div>
                            <?php } ?>
                        </div>
                        <div>
                            <label for="userPhone">Phone:</label>
                            <input
                                type="text"
                                class="<?= isset($_SESSION["errors"]["phone"]) ? 'form-control is-invalid' : '' ?>"
                                name="userPhone"
                                id="userPhone"
                                placeholder="01 23 45 67 89"
                                value="<?= htmlspecialchars($_SESSION["values"]["phone"] ?? "") ?>" />
                            <?php if (isset($_SESSION["errors"]["phone"])) { ?>
                                <div class="error"><?= htmlspecialchars($_SESSION["errors"]["phone"]) ?></div>
                            <?php } ?>
                        </div>
                    </fieldset>

                    <div class="div-button">
                        <button type="submit">Save</button>
                        <button type="reset" title="Cancel the changes" aria-label="Cancel the changes">
                            <i class="fa-solid fa-eraser"></i>
                        </button>
                    </div>
                </form>
            </section>
        </main>

        <!-- JavaScript files -->
        <script src="http://localhost:8000/assets/js/main.js"></script>
    </div>

    <?php unset($_SESSION['alert'], $_SESSION["errors"], $_SESSION["values"]); ?>
</body>

</html>