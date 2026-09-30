<?php

namespace App\Models;

use App\Core\Database;
use PDO;

final class Contact
{
    // Returns the connection to the database
    private static function db(): PDO
    {
        return Database::connect();
    }

    // Retrieves all contacts
    public static function getAll(): array
    {
        $stmt = self::db()->prepare("SELECT * FROM contacts");
        $stmt->execute();

        return $stmt->fetchAll() ?: [];
    }

    // Retrieves a contact by its ID
    public static function findById(int $id): array
    {
        $stmt = self::db()->prepare("SELECT * FROM contacts WHERE id = ?");
        $stmt->execute([$id]);

        return $stmt->fetch() ?: [];
    }

    // Inserts a contact and returns its ID
    public static function create(array $data): int
    {
        $stmt = self::db()->prepare("
            INSERT INTO contacts (name, email, phone)
            VALUES (:name, :email, :phone)
        ");

        $stmt->execute([
            "name" => $data["name"],
            "email" => $data["email"],
            "phone" => $data["phone"]
        ]);

        return self::db()->lastInsertId();
    }

    // Updates a contact from its ID and returns the number of affected rows
    public static function update(array $data, int $id): int
    {
        $stmt = self::db()->prepare("
            UPDATE contacts 
            SET name = :name, 
                email = :email, 
                phone = :phone 
            WHERE id = :id");

        $stmt->execute([
            "name" => $data["name"],
            "email" => $data["email"],
            "phone" => $data["phone"],
            "id" => $id
        ]);

        return $stmt->rowCount();
    }

    // Deletes a contact from its ID
    public static function destroy(int $id): int
    {
        $stmt = self::db()->prepare("DELETE FROM contacts WHERE id = ?");
        $stmt->execute([$id]);

        return $stmt->rowCount();
    }
}
