<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SetUserRoleController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProjectTaskController;
use App\Http\Controllers\SetTaskStatusController;
use App\Models\ProjectTask;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;

// Managing the user making the request
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->controller(AuthController::class)->group(function () {
    Route::get('/self', 'show');
    Route::put('/self', 'update');
    Route::post('/self', 'destroy');
    Route::post('/logout', 'logout');
});

Route::middleware('auth:sanctum')->group(function () {
    // To manage users, projects, and tasks associated with the projects
    Route::apiResource('users', UserController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);

    // To update the user role
    Route::patch('/users/{user}/role', SetUserRoleController::class);

    // ProjectTask model binding: /api/project-tasks/{projectTask}
    // URL: /api/project-tasks/project-uuid,task-uuid

    // To manage project tasks, excluding status
    Route::apiResource('project-tasks', ProjectTaskController::class)
        ->parameters(['project-tasks' => 'projectTask'])
        ->only(['store', 'update', 'destroy']);

    // To update the project task status
    Route::patch('/project-tasks/{projectTask}/status', SetTaskStatusController::class);
});

// To define the binding for the ProjectTask model
Route::bind('projectTask', function (string $value) {
    [$projectUuid, $taskUuid] = array_pad(explode(',', $value, 2), 2, null);

    abort_unless(
        $projectUuid && $taskUuid,
        Response::HTTP_NOT_FOUND,
        __('messages.resource_not_found')
    );

    return ProjectTask::where('project_uuid', $projectUuid)
        ->where('task_uuid', $taskUuid)
        ->firstOrFail();
});
