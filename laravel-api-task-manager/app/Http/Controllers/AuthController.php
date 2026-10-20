<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Retrieve the user using his email address
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
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
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
        ($user = $request->user())->update(
            $request->validate([
                'name' => 'bail|min:3|max:100',
                'password' => 'bail|min:8|confirmed',
                'email' => "bail|email|max:255|unique:users,email,{$user->id},id",
            ])
        );

        return $this->jsonResponse(
            [
                'message' => __('messages.self_updated', ['id' => $user->id]),
                'data' => UserResource::make($user)
            ]
        );
    }

    // Delete the user making the request
    public function destroy(Request $request): JsonResponse
    {
        ($user = $request->user())->deleteOrFail();

        return $this->jsonResponse(
            [
                'message' => __('messages.self_deleted', ['id' => $user->id]),
                'data' => UserResource::make($user)
            ]
        );
    }
}
