<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApiKey extends Middleware
{
    // Middleware that checks for the presence of the "API_KEY" key
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = config('services.api_key');

        if ($apiKey) {
            if (!$request->hasHeader('API_KEY')) {
                // Error: API_KEY is mandatory
                return $this->jsonError('api_key_required', Response::HTTP_BAD_REQUEST);
            }

            $key = $request->header('API_KEY');

            if ($key !== $apiKey) {
                // Error: API_KEY is incorrect
                return $this->jsonError('api_key_invalid', Response::HTTP_BAD_REQUEST);
            }

            $response = $next($request);
            $response->header('API_KEY', $key);

            return $response;
        } else {
            return $next($request);
        }
    }
}
