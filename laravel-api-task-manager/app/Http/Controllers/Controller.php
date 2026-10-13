<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

abstract class Controller
{
    protected function jsonResponse(mixed $data, int $httpCode = Response::HTTP_OK): JsonResponse
    {
        return response()->json($data, $httpCode);
    }
}
