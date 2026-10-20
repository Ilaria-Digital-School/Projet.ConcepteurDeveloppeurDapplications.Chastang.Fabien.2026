<?php

namespace App\Utilities;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class RenderJson
{
    public static function jsonError(
        string $message,
        int $httpCode = Response::HTTP_INTERNAL_SERVER_ERROR
    ): JsonResponse {
        return response()->json(
            [
                'message' => $message,
                'is_error' => true,
                'code_status' => $httpCode
            ],
            $httpCode
        );
    }
}
