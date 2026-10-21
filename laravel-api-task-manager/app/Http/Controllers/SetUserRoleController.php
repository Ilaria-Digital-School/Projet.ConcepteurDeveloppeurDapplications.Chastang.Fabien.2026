<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\JsonResponse;

class SetUserRoleController extends Controller
{
    // Updates the user role
    public function __invoke(Request $request, User $user): JsonResponse
    {
        // Validates the data
        $validated = $request->validate([
            'role' => ['bail', 'required', 'int', Rule::enum(UserRole::class)],
        ]);

        // Updates the user role
        $user->role = $validated['role'];
        $user->save();

        return $this->jsonResponse(
            [
                'message' => __('messages.user_role_updated', ['id' => $user->id]),
                'data' => UserResource::make($user)
            ]
        );
    }
}
