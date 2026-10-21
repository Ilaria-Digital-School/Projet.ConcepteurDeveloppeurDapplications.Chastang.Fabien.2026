<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Retrieve the user using this email address
        $user = User::where('email', $validated['email'])->first();

        // If the user exists, check his password
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            // Error: invalid credentials
            return $this->jsonError('credentials_invalid', Response::HTTP_UNAUTHORIZED);
        }

        // Retrieve the token name if it exists; otherwise, use the User-Agent
        $tokenName = $request->input(
            'token_name',
            $request->header('User-Agent', 'api-token')
        );
        // Then create the token
        $token = $user->createToken($tokenName)->plainTextToken;

        // Return the token
        return $this->jsonResponse(
            [
                'user' => UserResource::make($user),
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $self = $request->user();
        if ($request->filled('all') && filter_var($request->all, FILTER_VALIDATE_BOOL))
            // Disconnecting the current device
            $self->tokens()->delete();
        else
            // Disconnecting all devices (global logout)
            $self->currentAccessToken()->delete();

        return $this->jsonResponse(['message' => __('messages.logout_successful')]);
    }

    // Get the user making the request
    public function show(Request $request): JsonResponse
    {
        return $this->jsonResponse(['data' => UserResource::make($request->user())]);
    }

    // Update the user making the request
    public function update(Request $request): JsonResponse
    {
        ($self = $request->user())->update(
            $request->validate([
                'name' => 'bail|min:3|max:100',
                'password' => 'bail|min:8|confirmed',
                'email' => "bail|email|max:255|unique:users,email,{$self->id},id",
            ])
        );

        return $this->jsonResponse(
            [
                'message' => __('messages.self_updated', ['id' => $self->id]),
                'data' => UserResource::make($self)
            ]
        );
    }

    // Delete the user making the request
    public function destroy(Request $request): JsonResponse
    {
        ($self = $request->user())->deleteOrFail();

        return $this->jsonResponse(
            [
                'message' => __('messages.self_deleted', ['id' => $self->id]),
                'data' => UserResource::make($self)
            ]
        );
    }
}
