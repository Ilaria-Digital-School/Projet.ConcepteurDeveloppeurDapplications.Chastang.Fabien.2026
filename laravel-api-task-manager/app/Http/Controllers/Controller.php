<?php

namespace App\Http\Controllers;

use App\Utilities\RenderJson;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

abstract class Controller
{
    protected function jsonResponse(
        mixed $data,
        int $httpCode = Response::HTTP_OK,
        array $headers = []
    ): JsonResponse {
        return RenderJson::jsonResponse($data, $httpCode, $headers);
    }

    protected function jsonError(
        string $messagesKey,
        int $httpCode = Response::HTTP_INTERNAL_SERVER_ERROR,
        array $headers = []
    ): JsonResponse {
        return RenderJson::jsonError(__("messages.$messagesKey"), $httpCode, $headers);
    }
}
