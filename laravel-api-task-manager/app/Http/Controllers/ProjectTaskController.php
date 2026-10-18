<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatus;
use App\Http\Requests\ProjectTaskRequest;
use App\Models\ProjectTask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ProjectTaskController extends Controller
{
    // Store a newly created resource in storage
    public function store(ProjectTaskRequest $request): JsonResponse
    {
        $projectTask = ProjectTask::create($request->validated());

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_created'),
                'data' => $projectTask
            ],
            Response::HTTP_CREATED
        );
    }

    // Update the specified resource in storage: PATCH status
    public function update(ProjectTaskRequest $request, ProjectTask $projectTask): JsonResponse
    {
        if ($projectTask->status !== TaskStatus::Pending) {
            // Error: cannot update the project UUID or task UUID if the status is not "Pending"
            return $this->jsonError('resource_locked', Response::HTTP_LOCKED);
        }

        $projectTask->update($request->validated());

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_updated'),
                'data' => $projectTask
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
                'data' => $projectTask
            ]
        );
    }
}
