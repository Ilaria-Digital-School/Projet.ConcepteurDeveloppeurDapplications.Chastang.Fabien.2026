<?php

$title = "Save contact";
$description = "Page displaying the contact registration form";
$titleForm = "Registration";
$buttonSave = "Save";
$action = "create";
$name = htmlspecialchars($_SESSION["values"]["userName"] ?? "");
$email = htmlspecialchars($_SESSION["values"]["userEmail"] ?? "");
$phone = htmlspecialchars($_SESSION["values"]["userPhone"] ?? "");

// Registration form
require __DIR__ . '/form.php';
