<?php

namespace App\Http\Middleware;

use App\Utilities\RenderJson;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class Middleware
{
    protected function jsonError(
        string $messagesKey,
        int $httpCode = Response::HTTP_INTERNAL_SERVER_ERROR
    ): JsonResponse {
        return RenderJson::jsonError(__("messages.$messagesKey"), $httpCode);
    }
}
