<?php

namespace App\Repositories;

use PDO;
use App\Core\Database;
use App\Models\Contact;

final class ContactRepository
{
    // Tools: private methods ///////////////////

    // Returns the connection to the database
    private static function db(): PDO
    {
        return Database::connect();
    }

    // Formats the phone number: removes extra separator characters
    private static function formatPhone(string $value): string
    {
        $patterns = ["/\s{2,}/", "/\){2,}/", "/\({2,}/", "/\+{2,}/", "/\.{2,}/", "/-{2,}/"];
        $remplacements = [" ", ")", "(", "+", ".", "-"];
        return preg_replace($patterns, $remplacements, trim($value));
    }

    // To retrieve a contact list ///////////////

    // Retrieves all contacts: array of Contact objects
    public static function getAll(): array
    {
        $stmt = self::db()->prepare("SELECT * FROM contacts");
        $stmt->execute();
        $rows = $stmt->fetchAll();

        return $rows
            ? array_map(
                fn(array $row) => new Contact(
                    (int) $row['id'],
                    $row['name'],
                    $row['email'],
                    $row['phone']
                ),
                $rows
            )
            : [];
    }

    // Returns the contacts whose name matches the pattern:
    // array of Contact objects
    public static function getByName(string $name): array
    {
        $stmt = self::db()->prepare("SELECT * FROM contacts WHERE name LIKE ?");
        $stmt->execute([trim($name)]);
        $rows = $stmt->fetchAll();

        return $rows
            ? array_map(
                fn(array $row) => new Contact(
                    (int) $row['id'],
                    $row['name'],
                    $row['email'],
                    $row['phone']
                ),
                $rows
            )
            : [];
    }

    // To find a contact ////////////////////////

    // Retrieves a contact by its ID
    public static function findById(int $id): Contact | null
    {
        $stmt = self::db()->prepare("SELECT * FROM contacts WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        return $row
            ? new Contact(
                (int) $row['id'],
                $row['name'],
                $row['email'],
                $row['phone']
            )
            : null;
    }

    // Retrieves a contact by its email address
    public static function findByEmail(string $email): Contact | null
    {
        $stmt = self::db()->prepare("SELECT * FROM contacts WHERE email = ?");
        $stmt->execute([trim($email)]);
        $row = $stmt->fetch();

        return $row
            ? new Contact(
                (int) $row['id'],
                $row['name'],
                $row['email'],
                $row['phone']
            )
            : null;
    }

    // Retrieves a contact by its phone number
    public static function findByPhone(string $phone): Contact | null
    {
        $stmt = self::db()->prepare("SELECT * FROM contacts WHERE phone = ?");
        $stmt->execute([self::formatPhone($phone)]);
        $row = $stmt->fetch();

        return $row
            ? new Contact(
                (int) $row['id'],
                $row['name'],
                $row['email'],
                $row['phone']
            )
            : null;
    }

    // To manage a contact //////////////////////

    // Inserts a contact and returns its ID
    public static function create(array $data): int
    {
        $stmt = self::db()->prepare("
            INSERT INTO contacts (name, email, phone)
            VALUES (:name, :email, :phone)
        ");

        $stmt->execute([
            "name" => trim($data["userName"]),
            "email" => trim($data["userEmail"]),
            "phone" => self::formatPhone($data["userPhone"])
        ]);

        return (int) (self::db()->lastInsertId() ?? 0);
    }

    // Updates a contact by its ID and returns 1 if it was updated,
    // or 0 if it was not found (number of affected rows)
    public static function update(array $data, int $id): int
    {
        $stmt = self::db()->prepare("
            UPDATE contacts 
            SET name = :name, 
                email = :email, 
                phone = :phone 
            WHERE id = :id");

        $stmt->execute([
            "name" => trim($data["userName"]),
            "email" => trim($data["userEmail"]),
            "phone" => self::formatPhone($data["userPhone"]),
            "id" => $id
        ]);

        return $stmt->rowCount();
    }

    // Deletes a contact by its ID and returns 1 if it was deleted,
    // or 0 if it was not found (number of affected rows)
    public static function destroy(int $id): int
    {
        $stmt = self::db()->prepare("DELETE FROM contacts WHERE id = ?");
        $stmt->execute([$id]);

        return $stmt->rowCount();
    }
}
