<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SetUserRoleController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProjectTaskController;
use App\Http\Controllers\SetTaskPriorityController;
use App\Http\Controllers\SetTaskStatusController;
use App\Utilities\Binding;
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
    Route::middleware('role:2')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::apiResource('users-uuid', UserController::class)
            ->parameters(['users-uuid' => 'userUuid']);
    });

    // Super-administrators: modifying user roles
    Route::middleware('role:3')->group(function () {
        Route::patch('/users/{user}/role', SetUserRoleController::class);
        Route::patch('/users-uuid/{userUuid}/role', SetUserRoleController::class);
    });

    // All users: manage projects and the tasks associated with them
    // It is not possible to delete a project or a task if it is linked
    // to another task or project
    //
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('projects-uuid', ProjectController::class)
        ->parameters(['projects-uuid' => 'projectUuid']);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('tasks-uuid', TaskController::class)
        ->parameters(['tasks-uuid' => 'taskUuid']);

    // All users: manage project tasks, updates only the project UUID and
    // task UUID columns, and not the "status" and "priority" columns
    // It is not possible to update the project UUID or task UUID or delete a
    // project task if the status is not "Pending" and the priority is not "Low"
    //
    Route::apiResource('project-tasks', ProjectTaskController::class)
        ->parameters(['project-tasks' => 'projectTask']);

    // Administrators and super-administrators: updating project task "status" and
    // "priority", but only a super-administrator can revert to a previous status
    //
    Route::middleware('role:2')->group(function () {
        Route::patch('/project-tasks/{projectTask}/priority', SetTaskPriorityController::class);
        Route::patch('/project-tasks/{projectTask}/status', SetTaskStatusController::class);
    });
});

///////////////////////////////////////////////////////////////////////////////
// Defines the bindings for the User, Project, Task, and ProjectTask models

// User model binding: /api/user-uuid/{userUuid}
// URL: /api/user-uuid/the_user_UUID
Route::bind('userUuid', function (string $value) {
    return Binding::getModel($value, 'users', 'user_not_found');
});

// Project model binding: /api/project-uuid/{projectUuid}
// URL: /api/project-uuid/the_project_UUID
Route::bind('projectUuid', function (string $value) {
    return Binding::getModel($value, 'projects', 'project_not_found');
});

// Task model binding: /api/tasks-uuid/{taskUuid}
// URL: /api/task-uuid/the_task_UUID
Route::bind('taskUuid', function (string $value) {
    return Binding::getModel($value, 'tasks', 'task_not_found');
});

// ProjectTask model binding: /api/project-tasks/{projectTask}
// URL: /api/project-tasks/project_ID-or-project_UUID,task_ID-or-task_UUID
Route::bind('projectTask', function (string $value) {
    return Binding::getPivot($value);
});
