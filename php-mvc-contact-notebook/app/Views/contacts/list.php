<?php

/** @var array $contacts */
$description = "Page displaying the list of contacts";
$title = "Contact list";
$alertClass = "center";
?>

<section>
    <?php if (count($contacts) === 0) { ?>
        <h2 class="h2-title">No contact</h2>
    <?php } else { ?>
        <!-- Alert message: success/error -->
        <?php require __DIR__ . '/alert.php'; ?>

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
                            <th scope="row"><?= $contact->id ?></th>
                            <td><?= $contact->name ?></td>
                            <td><?= $contact->email ?></td>
                            <td><?= $contact->phone ?></td>
                            <td style="white-space: nowrap;">
                                <button
                                    type="button"
                                    class="btn btn-success"
                                    title="Éditer le contact"
                                    aria-label="Éditer le contact"
                                    onclick="edit(<?= $contact->id ?>)">
                                    <i class="fa-brands fa-jxl"></i>
                                </button>
                                <form id="destroy_<?= $contact->id ?>" action="/contacts/delete" method="POST" class="d-inline">
                                    <input type="hidden" name="id" value="<?= $contact->id ?>">
                                    <button
                                        type="button"
                                        class="btn btn-danger"
                                        title="Supprimer le contact"
                                        aria-label="Supprimer le contact"
                                        onclick="remove(<?= $contact->id ?>)">
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

<!-- Delete flash messages -->
<?php unset($_SESSION['alert']); ?>