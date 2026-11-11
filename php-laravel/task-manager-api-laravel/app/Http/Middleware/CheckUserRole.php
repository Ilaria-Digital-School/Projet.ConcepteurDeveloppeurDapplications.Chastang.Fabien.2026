<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole extends Middleware
{
    // Check the user role
    public function handle(Request $request, Closure $next, int $minRole): Response
    {
        if (!($user = $request->user()))
            // Error: 401 Unauthorized
            return $this->jsonError('user_auth_required', Response::HTTP_UNAUTHORIZED);

        if ($user->role->value < UserRole::from($minRole)->value)
            // Error: 403 Forbidden
            return $this->jsonError('forbidden_request', Response::HTTP_FORBIDDEN);

        return $next($request);
    }
}
