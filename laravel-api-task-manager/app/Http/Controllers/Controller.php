<?php

namespace App\Http\Controllers;

use App\Utilities\RenderJson;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

abstract class Controller
{
    protected function jsonResponse(
        mixed $data,
        int $httpCode = Response::HTTP_OK
    ): JsonResponse {
        return RenderJson::jsonResponse($data, $httpCode);
    }

    protected function jsonError(
        string $messagesKey,
        int $httpCode = Response::HTTP_INTERNAL_SERVER_ERROR
    ): JsonResponse {
        return RenderJson::jsonError(__("messages.$messagesKey"), $httpCode);
    }
}
