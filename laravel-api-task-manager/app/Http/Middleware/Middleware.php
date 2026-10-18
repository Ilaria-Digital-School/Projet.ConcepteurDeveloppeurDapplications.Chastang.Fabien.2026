<?php

namespace App\Http\Middleware;

use Symfony\Component\HttpFoundation\Response;

class Middleware
{
    protected function jsonError(
        string $messagesKey,
        int $httpCode = Response::HTTP_INTERNAL_SERVER_ERROR
    ): Response {
        return response()->json(
            [
                'message' => __("messages.$messagesKey"),
                'is_error' => true,
                'code_status' => $httpCode
            ],
            $httpCode
        );
    }
}
