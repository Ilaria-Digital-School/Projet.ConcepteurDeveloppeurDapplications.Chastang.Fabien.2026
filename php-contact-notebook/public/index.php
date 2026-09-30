<?php
session_start();

use App\Controllers\ContactController;

require_once __DIR__ . '/../vendor/autoload.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/') ?: '/';

$controller = new ContactController();

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
    http_response_code(404);
    echo "Page not found";
}
