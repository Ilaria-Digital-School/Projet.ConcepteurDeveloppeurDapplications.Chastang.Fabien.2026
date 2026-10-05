<?php
session_start();

require_once __DIR__ . '/../vendor/autoload.php';

// Load the .env file
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/../");
$dotenv->load();

use App\Controllers\ContactController;
use App\Core\Exceptions\AppException;
use App\Core\Exceptions\NotFoundException;
use App\Core\Exceptions\DatabaseException;
use App\Core\Exceptions\ServerErrorException;

// Parse the URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/') ?: '/';

$controller = new ContactController();

try {
    if ($method === 'GET' && ($uri === '/' || $uri === '/contacts')) {
        $controller->getAll();
    } elseif ($method === 'GET' && $uri === '/contacts/create') {
        $controller->getCreateForm();
    } elseif ($method === 'POST' && $uri === '/contacts/create') {
        $controller->store();
    } elseif ($method === 'GET' && $uri === '/contacts/edit') {
        $controller->getEditForm();
    } elseif ($method === 'POST' && $uri === '/contacts/update') {
        $controller->update();
    } elseif ($method === 'POST' && $uri === '/contacts/delete') {
        $controller->destroy();
    } else {
        throw new NotFoundException("Page Not Found");
    }
} catch (NotFoundException $e) {
    // Status: 404 Resource Not Found
    $e->display();
} catch (DatabaseException $e) {
    // Database exception -> Status: 500 Internal Server Error
    $e->display();
} catch (ServerErrorException $e) {
    // Status: 500 Internal Server Error
    $e->display();
} catch (Throwable $e) {
    // Other exceptions and errors -> Status: 500 Internal Server Error
    AppException::page($e, 500);
}
