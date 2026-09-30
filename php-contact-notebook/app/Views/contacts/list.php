<?php

/** @var array $contacts */
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Page displaying the list of contacts">
    <title>List – Contact</title>

    <!-- CSS files -->
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />
    <link rel="stylesheet" href="./assets/css/style.css" />
</head>

<body>
    <div class="wrapper">
        <header></header>

        <main>
            <section>
                <?php if (count($contacts) === 0) { ?>
                    <h2 class="h2-title">No contact</h2>
                <?php } else { ?>
                    <?php if (isset($_SESSION['alert'])) { ?>
                        <div class="alert alert-<?= $_SESSION['alert']['type'] ?> center" role="alert">
                            <?= htmlspecialchars($_SESSION['alert']['message']) ?>
                        </div>
                    <?php } ?>

                    <!--Contact list -->
                    <h2 class="h2-title-list">
                        <span>Contact list</span>
                        <a href="/contacts/create" class="bolder">Add a contact</a>
                    </h2>

                    <div class="table-responsive">
                        <table class="table table-striped table-hover table-sm">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody class="table-group-divider">
                                <?php
                                foreach ($contacts as $contact) { ?>
                                    <tr>
                                        <th scope="row"><?= $contact['id'] ?></th>
                                        <td><?= $contact['name'] ?></td>
                                        <td><?= $contact['email'] ?></td>
                                        <td><?= $contact['phone'] ?></td>
                                        <td style="white-space: nowrap;">
                                            <button
                                                type="button"
                                                class="btn btn-success"
                                                title="Éditer le contact"
                                                aria-label="Éditer le contact"
                                                onclick="edit(<?= $contact['id'] ?>)">
                                                <i class="fa-brands fa-jxl"></i>
                                            </button>
                                            <form id="destroy_<?= $contact['id'] ?>" action="/contacts/delete" method="POST" class="d-inline">
                                                <input type="hidden" name="id" value="<?= $contact['id'] ?>">
                                                <button
                                                    type="button"
                                                    class="btn btn-danger"
                                                    title="Supprimer le contact"
                                                    aria-label="Supprimer le contact"
                                                    onclick="remove(<?= $contact['id'] ?>)">
                                                    <i class="fa-solid fa-user-xmark"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>
                <?php } ?>
            </section>
        </main>

        <!-- JavaScript files -->
        <script src="./assets/js/main.js"></script>
    </div>

    <?php unset($_SESSION['alert']); ?>
</body>

</html>