<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    // Initializes the language and regional settings used by the API
    public function handle(Request $request, Closure $next): Response
    {
        app()->setLocale($request->header('Accept-Language', 'en'));
        return $next($request);
    }
}
