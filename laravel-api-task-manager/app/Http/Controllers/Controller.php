<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

abstract class Controller
{
    protected function jsonResponse(
        mixed $data,
        int $httpCode = Response::HTTP_OK
    ): JsonResponse {
        return response()->json($data, $httpCode);
    }

    protected function jsonError(
        string $messagesKey,
        int $httpCode = Response::HTTP_INTERNAL_SERVER_ERROR
    ): JsonResponse {
        return $this->jsonResponse(
            [
                'message' => __("messages.$messagesKey"),
                'is_error' => true,
                'code_status' => $httpCode
            ],
            $httpCode
        );
    }
}
