<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends Controller
{
    // Display a listing of the resource
    public function index(): JsonResponse
    {
        return $this->jsonResponse(TaskResource::collection(
            Task::with('projects')->latest()->get()
        ));
    }

    // Store a newly created resource in storage
    public function store(TaskRequest $request): JsonResponse
    {
        $task = Task::create($request->validated());

        return $this->jsonResponse(
            [
                'message' => __('messages.task_created', ['id' => $task->id]),
                'data' => TaskResource::make($task)
            ],
            Response::HTTP_CREATED
        );
    }

    // Display the specified resource
    public function show(Task $task): JsonResponse
    {
        return $this->jsonResponse(
            ['data' => TaskResource::make($task->load('projects'))]
        );
    }

    // Update the specified resource in storage
    public function update(TaskRequest $request, Task $task): JsonResponse
    {
        $task->update($request->validated());

        return $this->jsonResponse(
            [
                'message' => __('messages.task_updated', ['id' => $task->id]),
                'data' => TaskResource::make($task->load('projects'))
            ]
        );
    }

    // Remove the specified resource from storage
    public function destroy(Task $task): JsonResponse
    {
        $data = TaskResource::make($task->load('projects'));
        $task->deleteOrFail();

        return $this->jsonResponse(
            [
                'message' => __('messages.task_deleted', ['id' => $task->id]),
                $data
            ]
        );
    }
}
