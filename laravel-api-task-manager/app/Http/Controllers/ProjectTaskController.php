<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectTaskRequest;
use App\Http\Resources\ProjectTaskResource;
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
                'data' => ProjectTaskResource::make(
                    $projectTask->load('projects.tasks.status')
                )
            ],
            Response::HTTP_CREATED
        );
    }

    // Update the specified resource in storage: PATCH status
    public function update(ProjectTaskRequest $request, ProjectTask $projectTask): JsonResponse
    {
        $projectTask->update($request->validated());

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_updated'),
                'data' => ProjectTaskResource::make(
                    $projectTask->load('projects.tasks.status')
                )
            ]
        );
    }

    // Remove the specified resource from storage
    public function destroy(ProjectTask $projectTask): JsonResponse
    {
        $data = ProjectTaskResource::make($projectTask->load('projects.tasks.status'));
        $projectTask->deleteOrFail();

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_deleted'),
                $data
            ]
        );
    }
}
