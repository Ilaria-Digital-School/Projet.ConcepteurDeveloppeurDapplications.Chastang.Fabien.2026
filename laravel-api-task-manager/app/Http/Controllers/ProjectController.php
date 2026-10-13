<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    // Display a listing of the resource
    public function index(): JsonResponse
    {
        return $this->jsonResponse(ProjectResource::collection(
            Project::with('tasks')->latest()->get()
        ));
    }

    // Store a newly created resource in storage
    public function store(ProjectRequest $request): JsonResponse
    {
        $project = Project::create($request->validated());

        return $this->jsonResponse(
            [
                'message' => __('messages.project_created', ['id' => $project->id]),
                'data' => ProjectResource::make($project)
            ],
            Response::HTTP_CREATED
        );
    }

    // Display the specified resource
    public function show(Project $project): JsonResponse
    {
        return $this->jsonResponse(
            ['data' => ProjectResource::make($project->load('tasks.status'))]
        );
    }

    // Update the specified resource in storage
    public function update(ProjectRequest $request, Project $project): JsonResponse
    {
        $project->update($request->validated());

        return $this->jsonResponse(
            [
                'message' => __('messages.project_updated', ['id' => $project->id]),
                'data' => ProjectResource::make($project->load('tasks.status'))
            ]
        );
    }

    // Remove the specified resource from storage
    public function destroy(Project $project): JsonResponse
    {
        $data = ProjectResource::make($project->load('tasks.status'));
        $project->deleteOrFail();

        return $this->jsonResponse(
            [
                'message' => __('messages.project_deleted', ['id' => $project->id]),
                $data
            ]
        );
    }
}
