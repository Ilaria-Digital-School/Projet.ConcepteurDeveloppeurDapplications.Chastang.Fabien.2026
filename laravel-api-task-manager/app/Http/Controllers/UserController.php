<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    // Display a listing of the resource
    public function index(): JsonResponse
    {
        return $this->jsonResponse(
            UserResource::collection(User::latest()->get())
        );
    }

    // Store a newly created resource in storage
    public function store(UserRequest $request): JsonResponse
    {
        $user = User::create($request->validated());

        return $this->jsonResponse(
            [
                'message' => __('messages.user_created', ['id' => $user->id]),
                'data' => UserResource::make($user)
            ],
            Response::HTTP_CREATED
        );
    }

    // Display the specified resource
    public function show(User $user): JsonResponse
    {
        return $this->jsonResponse(['data' => UserResource::make($user)]);
    }

    // Update the specified resource in storage
    public function update(UserRequest $request, User $user): JsonResponse
    {
        $user->update($request->validated());

        return $this->jsonResponse(
            [
                'message' => __('messages.user_updated', ['id' => $user->id]),
                'data' => UserResource::make($user)
            ]
        );
    }

    // Remove the specified resource from storage
    public function destroy(User $user): JsonResponse
    {
        $user->deleteOrFail();

        return $this->jsonResponse(
            [
                'message' => __('messages.user_deleted', ['id' => $user->id]),
                'data' => UserResource::make($user)
            ]
        );
    }
}
