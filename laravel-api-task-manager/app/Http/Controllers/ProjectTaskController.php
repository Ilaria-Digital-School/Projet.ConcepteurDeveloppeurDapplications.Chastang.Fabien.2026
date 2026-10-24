<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatus;
use App\Http\Requests\ProjectTaskRequest;
use App\Http\Resources\ProjectTaskResource;
use App\Models\ProjectTask;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ProjectTaskController extends Controller
{
    // Display a listing of the resource
    public function index(): JsonResponse
    {
        return $this->jsonResponse(ProjectTaskResource::collection(
            ProjectTask::with(['project', 'task'])->latest()->get()
        ));
    }

    // Store a newly created resource in storage
    public function store(ProjectTaskRequest $request): JsonResponse
    {
        $projectTask = ProjectTask::create($request->validated());

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_created'),
                'data' => ProjectTaskResource::make($projectTask->load(['project', 'task']))
            ],
            Response::HTTP_CREATED
        );
    }

    // Display the specified resource
    public function show(ProjectTask $projectTask): JsonResponse
    {
        return $this->jsonResponse(
            ['data' => ProjectTaskResource::make($projectTask->load(['project', 'task']))]
        );
    }

    // Update only the project UUID and/or the task UUID, not the status or priority
    public function update(ProjectTaskRequest $request, ProjectTask $projectTask): JsonResponse
    {
        if ($projectTask->status !== TaskStatus::Pending) {
            // Error: cannot update the project UUID or task UUID if the status is not "Pending"
            return $this->jsonError('resource_locked', Response::HTTP_LOCKED);
        }

        if (
            $request->filled('project_uuid') && $request->project_uuid !== $projectTask->project_uuid
            || $request->filled('task_uuid') && $request->task_uuid !== $projectTask->task_uuid
        ) {
            // Changes have been made, an update is required
            $projectTask->update($request->validated());
        }

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_updated'),
                'data' => ProjectTaskResource::make($projectTask->load(['project', 'task']))
            ]
        );
    }

    // Remove the specified resource from storage
    public function destroy(ProjectTask $projectTask): JsonResponse
    {
        if ($projectTask->status !== TaskStatus::Pending) {
            // Error: cannot delete the project task if the status is not "Pending"
            return $this->jsonError('resource_locked', Response::HTTP_LOCKED);
        }

        $projectTask->deleteOrFail();

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_deleted'),
                'data' => ProjectTaskResource::make($projectTask->load(['project', 'task']))
            ]
        );
    }
}
