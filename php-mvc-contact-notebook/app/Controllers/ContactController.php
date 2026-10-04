<?php

namespace App\Controllers;

use App\Core\Validator;
use App\Repository\ContactRepository;

class ContactController
{
    // Tools: private methods ///////////////////

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
        $id = filter_input($type, "id", FILTER_VALIDATE_INT) ?? 0;
        if (!$id) $this->redirect(); // Error: redirect to the list
        return $id;
    }

    // Validate the form data
    private function validateData(string $location = ""): bool
    {
        // Validates the data
        $validator = (new Validator($_POST))
            ->required('userName')
            ->min('userName', 5)
            ->max('userName', 50)
            ->required('userEmail')
            ->email('userEmail')
            ->required('userPhone')
            ->phone('userPhone');

        if ($validator->fails()) {
            // Retrieves errors and raw values
            $_SESSION["errors"] = $validator->getErrors();
            $_SESSION["values"] = $_POST;

            // Overall message
            $_SESSION["alert"] = [
                "type" => "danger",
                "message" => "Contact validation failed."
            ];

            // Redirect to the form
            $this->redirect($location);
        }

        return true;
    }

    // Verify the uniqueness of email addresses and phone numbers
    private function isUnique(string $location, int $id = 0): bool
    {
        $fails = 0;
        $errors = [];

        $contact = ContactRepository::findByEmail($_POST['userEmail']);
        if (!is_null($contact) && $contact->id !== $id) {
            // Error: this email address already exists
            $fails |= 1;
            $errors["userEmail"] = "This email address already exists.";
        }

        $contact = ContactRepository::findByPhone($_POST['userPhone']);
        if (!is_null($contact) && $contact->id !== $id) {
            // Error: this phone number already exists
            $fails |= 2;
            $errors["userPhone"] = "This phone number already exists.";
        }

        if ($fails !== 0) {
            // Retrieves errors and raw values
            $_SESSION["errors"] = $errors;
            $_SESSION["values"] = $_POST;

            // Overall message
            $_SESSION["alert"] = [
                "type" => "danger",
                "message" => match ($fails) {
                    1 => "The email address already exists.",
                    2 => "The phone number already exists.",
                    default => "The email address and the phone number already exist.",
                }
            ];

            // Redirect to the form
            $this->redirect($location);
        }

        return true;
    }

    // Public methods of the controller /////////

    // Display the list
    public function getAll(): void
    {
        $contacts = ContactRepository::getAll();

        // Display the list
        ob_start();
        require __DIR__ . '/../Views/contacts/list.php';
        $view = ob_get_clean();

        require __DIR__ . '/../Views/layouts/app.php';
    }

    // Display the registration form
    public function getCreateForm(): void
    {
        // Display the form
        ob_start();
        require __DIR__ . '/../Views/contacts/create.php';
        $view = ob_get_clean();

        require __DIR__ . '/../Views/layouts/app.php';
    }

    // Save a contact to the database
    public function store(): void
    {
        // Validate the use of the HTTP POST method
        $this->validatePostMethod("/create");

        if (
            $this->validateData("/create")
            && $this->isUnique('/create')
        ) {
            // Success: insert the contact
            $id = ContactRepository::create($_POST);

            // Overall message
            $_SESSION["alert"] = $id > 0
                ? [
                    "type" => "success",
                    "message" => "Contact successfully saved."
                ]
                : [
                    "type" => "danger",
                    "message" => "Failed to insert the contact into the database."
                ];

            // Redirection
            $this->redirect($id > 0 ? '' : '/create');
        }
    }

    // Display the edit form
    public function getEditForm(): void
    {
        // Retrieves the contact ID
        $id = $this->getId(INPUT_GET);

        // Retrieves a contact by its ID
        $contact = ContactRepository::findById($id);
        if (!$contact) $this->redirect(); // Error: redirect to the list

        // Display the form
        ob_start();
        require __DIR__ . '/../Views/contacts/edit.php';
        $view = ob_get_clean();

        require __DIR__ . '/../Views/layouts/app.php';
    }

    // Update a contact in the database
    public function update(): void
    {
        // Validate the use of the HTTP POST method
        $this->validatePostMethod();

        // Retrieves the contact ID
        $id = $this->getId(INPUT_POST);

        if (
            $this->validateData('/edit?id=' . $id)
            && $this->isUnique('/edit?id=' . $id, $id)
        ) {
            // Success: insert the contact
            $rowCount = ContactRepository::update($_POST, $id);

            // Overall message
            $_SESSION["alert"] = [
                "type" => "success",
                "message" => $rowCount > 0
                    ? "Contact successfully updated."
                    : "Contact already up to date."
            ];

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
            $rowCount = ContactRepository::destroy($id);

            $_SESSION["alert"] = $rowCount > 0
                ? [
                    "type" => "success",
                    "message" => "Contact successfully deleted."
                ]
                : [
                    "type" => "danger",
                    "message" => "No delete, contact not found."
                ];
        }

        // Redirect to the list
        $this->redirect();
    }
}
