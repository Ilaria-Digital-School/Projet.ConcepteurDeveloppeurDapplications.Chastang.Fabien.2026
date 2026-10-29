<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApiKey extends Middleware
{
    // Middleware that checks for the presence of the API key
    public function handle(Request $request, Closure $next): Response
    {
        if ($apiKey = config('services.api_key')) {
            // API_KEY is defined in the application: config\services.php
            if (!$request->hasHeader('X-API-Key'))
                // Error: API_KEY is mandatory
                return $this->jsonError('api_key_required', Response::HTTP_BAD_REQUEST);

            if (($key = $request->header('X-API-Key')) !== $apiKey)
                // Error: API_KEY is incorrect
                return $this->jsonError('api_key_invalid', Response::HTTP_BAD_REQUEST);

            $response = $next($request);
            $response->header('X-API-Key', $key);

            return $response;
        } else {
            return $next($request);
        }
    }
}
