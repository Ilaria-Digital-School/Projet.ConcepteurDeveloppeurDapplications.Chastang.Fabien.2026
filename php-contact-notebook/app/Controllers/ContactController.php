<?php

namespace App\Controllers;

use App\Models\Contact;

// Class to retrieve the contact information //////////////////////////////////

final class ContactData
{
    // Retrieves the contact ID
    public static function getId(int $type): int
    {
        return filter_input($type, "id", FILTER_VALIDATE_INT) ?? 0;
    }

    // Retrieves the data
    public static function getData(): array
    {
        $_SESSION["errors"] = [];
        $_SESSION["values"] = [];

        // Name field
        $name = filter_input(INPUT_POST, "userName") ?? false;
        if ($name === false || ($length = strlen($name = trim($name))) < 5) {
            $_SESSION["errors"]["name"] = "This field must have a minimum of 5 characters.";
        } elseif ($length > 50) {
            $_SESSION["errors"]["name"] = "This field must have a maximum of 50 characters.";
        }

        // Email field
        $email = filter_input(INPUT_POST, "userEmail", FILTER_VALIDATE_EMAIL) ?? false;
        if ($email === false) {
            $_SESSION["errors"]["email"] = "This mandatory field must be a valid email address.";
        }

        // Phone field
        $phone = filter_input(INPUT_POST, "userPhone", FILTER_VALIDATE_REGEXP, [
            "options" => [
                "regexp" => "/^(?:[\s)(+.-]*\d+){8,}[\s)(+.-]*$/"
            ]
        ]) ?? false;
        if ($phone === false) {
            $_SESSION["errors"]["phone"] = "This mandatory field must be a valid phone number.";
        } else {
            $phone = trim($phone);
        }

        if (count($_SESSION["errors"]) > 0) {
            // Error: retrieve raw values
            $_SESSION["values"]["name"] = $_POST["userName"] ?? "";
            $_SESSION["values"]["email"] = $_POST["userEmail"] ?? "";
            $_SESSION["values"]["phone"] = $_POST["userPhone"] ?? "";

            // Overall message
            $_SESSION["alert"] = [
                "type" => "danger",
                "message" => "Contact validation failed"
            ];
        } else {
            // No error: destroy the session variables
            unset($_SESSION["errors"], $_SESSION["values"]);
        }

        // Returns the values, formatted ​​on success
        return [
            "name" => $name,
            "email" => $email,
            "phone" => $phone
        ];
    }
}

// Contact controller /////////////////////////////////////////////////////////

class ContactController
{
    // Tools ////////////////////////////////////

    // Redirection function: by default, redirect to the contact list
    private function redirect(string $location = ""): void
    {
        header("Location: /contacts" . $location);
        exit;
    }

    // Validate the use of the HTTP POST method
    private function validatePostMethod(string $location = ""): void
    {
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            // Error: redirect to the form
            $this->redirect($location);
        }
    }

    // Retrieves the contact ID
    private function getId(int $type): int
    {
        $id = ContactData::getId($type);
        if (!$id) $this->redirect(); // Error: redirect to the list
        return $id;
    }

    // Controller methods ///////////////////////

    // Display the list
    public function getAll(): void
    {
        $contacts = Contact::getAll();
        require __DIR__ . "/../Views/contacts/list.php";
    }

    // Display the registration form
    public function getCreateForm(): void
    {
        require __DIR__ . "/../Views/contacts/create.php";
    }

    // Save a contact to the database
    public function store(): void
    {
        // Validate the use of the HTTP POST method
        $this->validatePostMethod("/create");

        // Retrieves the data
        $data = ContactData::getData();

        if (isset($_SESSION["errors"])) {
            // Error: redirect to the form
            $this->redirect("/create");
        } else {
            // Success: insert the contact
            $id = Contact::create($data);

            if ($id) {
                // Overall message
                $_SESSION["alert"] = [
                    "type" => "success",
                    "message" => "Contact successfully saved"
                ];

                // Redirect to the list
                $this->redirect();
            } else {
                // Error: overall message
                $_SESSION["alert"] = [
                    "type" => "danger",
                    "message" => "Failed to insert the contact into the database"
                ];

                // Redirect to the form
                $this->redirect("/create");
            }
        }
    }

    // Display the edit form
    public function getEditForm(): void
    {
        // Retrieves the contact ID
        $id = $this->getId(INPUT_GET);

        // Retrieves a contact by its ID
        $contact = Contact::findById($id);
        if (!$contact) $this->redirect(); // Error: redirect to the list
        require __DIR__ . "/../Views/contacts/edit.php";
    }

    // Update a contact in the database
    public function update(): void
    {
        // Validate the use of the HTTP POST method
        $this->validatePostMethod();

        // Retrieves the contact ID
        $id = $this->getId(INPUT_POST);

        // Retrieves the data
        $data = ContactData::getData();

        if (isset($_SESSION["errors"])) {
            // Error: redirect to the form
            $this->redirect("/edit?id=" . $id);
        } else {
            // Success: insert the contact
            $rowCount = Contact::update($data, $id);

            if ($rowCount > 0) {
                // Overall message
                $_SESSION["alert"] = [
                    "type" => "success", 
                    "message" => "Contact successfully updated"
                ];
            }

            // Redirect to the list
            $this->redirect();
        }
    }

    // Delete a contact from the database
    public function destroy(): void
    {
        // Validate the use of the HTTP POST method
        $this->validatePostMethod();

        // Retrieves the contact ID
        $id = $this->getId(INPUT_POST);
        if ($id) {
            $rowCount = Contact::destroy($id);

            $_SESSION["alert"] = $rowCount > 0
                ? ["type" => "success", "message" => "Contact successfully deleted"]
                : ["type" => "danger", "message" => "No delete, contact not found"];
        }

        // Redirect to the list
        $this->redirect();
    }
}
