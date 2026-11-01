<?php

namespace App\Utilities;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class RenderJson
{
    public static function jsonResponse(
        mixed $data,
        int $httpCode = Response::HTTP_OK,
        array $headers = []
    ): JsonResponse {
        return response()->json($data, $httpCode, $headers);
    }

    public static function jsonError(
        string $message,
        int $httpCode = Response::HTTP_INTERNAL_SERVER_ERROR,
        array $headers = []
    ): JsonResponse {
        return response()->json(
            [
                'message' => $message,
                'is_error' => true,
                'code_status' => $httpCode
            ],
            $httpCode,
            $headers
        );
    }
}
