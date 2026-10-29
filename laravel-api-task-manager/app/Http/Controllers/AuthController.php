<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Utilities\Validation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    // User login
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Retrieve the user using this email address
        $user = User::where('email', $validated['email'])->first();

        // If the user exists, check his password
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            // Security: add a 0.2 second delay to avoid indicating
            // that the email address does not exist
            if (!$user) usleep(200_000);

            // Error: invalid credentials
            return $this->jsonError('credentials_invalid', Response::HTTP_UNAUTHORIZED);
        }

        // Retrieve the token name if it exists; otherwise, use the User-Agent
        $tokenName = $request->input(
            'token_name',
            $request->header('User-Agent', 'api-token')
        );

        // Next, create the token and return it
        return $this->jsonResponse(
            [
                // Return the data of the logged-in user
                'user' => UserResource::make($user),
                // Create the token
                'token' => $user->createToken($tokenName)->plainTextToken,
                // Define the token type
                'token_type' => 'Bearer',
            ]
        );
    }

    // User logout
    public function logout(Request $request): JsonResponse
    {
        $self = $request->user();
        if ($request->filled('all') && filter_var($request->all, FILTER_VALIDATE_BOOL))
            // Disconnecting all devices (global logout)
            $self->tokens()->delete();
        else
            // Disconnecting the current device
            $self->currentAccessToken()->delete();

        return $this->jsonResponse(['message' => __('messages.logout_successful')]);
    }

    // Get the account of the user who has made the request
    public function show(Request $request): JsonResponse
    {
        return $this->jsonResponse(['data' => UserResource::make($request->user())]);
    }

    // Update the account of the user who has made the request
    public function update(Request $request): JsonResponse
    {
        ($self = $request->user())->update(
            $request->validate([
                'name' => 'bail|min:3|max:100',
                'password' => Validation::rulesPassword($request->method(), true),
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

    // Delete the account of the user who has made the request
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
