<?php

/** @var \App\Models\Contact $contact */
$description = "Page displaying the contact editing form";
$title = "Edit contact";
$titleForm = "Modification";
$buttonSave = "Modify";
$name = $contact->name;
$email = $contact->email;
$phone = $contact->phone;

// Modification form
require __DIR__ . '/form.php';
