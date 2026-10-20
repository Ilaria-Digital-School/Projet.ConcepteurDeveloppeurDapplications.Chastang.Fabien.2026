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

// Autonomous account management by the user
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->controller(AuthController::class)->group(function () {
    Route::get('/self', 'show');
    Route::put('/self', 'update');
    Route::post('/self', 'destroy');
    Route::post('/logout', 'logout');
});

Route::middleware('auth:sanctum')->group(function () {
    // Administrators and super-administrators: user management, excluding their roles
    Route::middleware('role:2')->apiResource('users', UserController::class);

    // Super-administrators: modifying user roles
    Route::middleware('role:3')->patch('/users/{user}/role', SetUserRoleController::class);

    // All users: manage projects and the tasks associated with them
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);

    // All users: manage project tasks, with the exception of their status
    // ProjectTask model binding: /api/project-tasks/{projectTask}
    Route::apiResource('project-tasks', ProjectTaskController::class)
        ->parameters(['project-tasks' => 'projectTask'])
        ->only(['store', 'update', 'destroy']);

    // Administrators and super-administrators: updating project task status
    // But only a super-administrator can revert to a previous status, this
    // functionality is implemented in the controller
    Route::middleware('role:2')->patch('/project-tasks/{projectTask}/status', SetTaskStatusController::class);
});

// Defines the binding for the ProjectTask model
// URL: /api/project-tasks/project-uuid,task-uuid
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
