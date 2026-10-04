<?php

namespace App\Core;

use PDO;
use PDOException;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/../../");
$dotenv->load();

final class Database
{
    private static ?PDO $pdo = null;

    public static function connect(): PDO
    {
        if (is_null(self::$pdo)) {
            try {
                self::$pdo = new PDO($_ENV["DSN"], $_ENV["DB_USER"], $_ENV["DB_PSWD"], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);
            } catch (PDOException $e) {
                throw $e;
            }
        }
        return self::$pdo;
    }
}
