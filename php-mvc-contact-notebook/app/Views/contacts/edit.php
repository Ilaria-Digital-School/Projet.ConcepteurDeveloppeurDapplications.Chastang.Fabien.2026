<?php

/** @var \App\Models\Contact $contact */

$title = "Edit contact";
$description = "Page displaying the contact editing form";
$titleForm = "Modification";
$buttonSave = "Modify";
$action = "update";
$name = htmlspecialchars($_SESSION["values"]["userName"] ?? $contact->name);
$email = htmlspecialchars($_SESSION["values"]["userEmail"] ?? $contact->email);
$phone = htmlspecialchars($_SESSION["values"]["userPhone"] ?? $contact->phone);

// Modification form
require __DIR__ . '/form.php';
