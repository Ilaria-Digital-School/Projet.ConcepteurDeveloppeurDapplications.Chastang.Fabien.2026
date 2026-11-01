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

// User login
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->middleware('api.key')->group(function () {

    // Autonomous account management by the user
    Route::controller(AuthController::class)->group(function () {
        Route::get('/self', 'show');
        Route::put('/self', 'update');
        Route::post('/self', 'destroy');
        Route::post('/logout', 'logout');
    });

    // Administrators and super-administrators: user management, excluding their roles
    Route::middleware('user.role:2')->group(function () {
        // Model binding with the ID (native)
        Route::apiResource('users', UserController::class);

        // Model binding with the UUID: userUuid
        Route::apiResource('users-uuid', UserController::class)
            ->parameters(['users-uuid' => 'userUuid']);
    });

    // Super-administrators: modifying user roles
    Route::middleware('user.role:3')->group(function () {
        // Model binding with the ID (native)
        Route::patch('/users/{user}/role', SetUserRoleController::class);

        // Model binding with the UUID: userUuid
        Route::patch('/users-uuid/{userUuid}/role', SetUserRoleController::class);
    });

    // All users: manage projects and the tasks associated with them
    // It is not possible to delete a project or a task if it is linked to another
    // task or project, furthermore, only the user who created the resource may
    // delete it, unless that user is an administrator or super-administrator

    // Model bindings with the ID (native)
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);

    // Model bindings with the UUID: projectUuid, taskUuid
    Route::apiResource('projects-uuid', ProjectController::class)
        ->parameters(['projects-uuid' => 'projectUuid']);
    Route::apiResource('tasks-uuid', TaskController::class)
        ->parameters(['tasks-uuid' => 'taskUuid']);

    // Model binding with the ID and/or the UUID: projectTask
    //
    // All users: manage project tasks, updates only the project UUID and
    // task UUID columns, and not the status and priority columns
    // It is not possible to update the UUID of a project or task, or to delete
    // a project task, if its status is not "Pending" or if its priority is
    // "High", furthermore, only the user who created the resource may update or
    // delete it, unless that user is an administrator or super-administrator

    Route::apiResource('project-tasks', ProjectTaskController::class)
        ->parameters(['project-tasks' => 'projectTask']);

    // Administrators and super-administrators: updating project task status and
    // priority, but only a super-administrator can revert to a previous status

    Route::middleware('user.role:2')->group(function () {
        Route::patch('/project-tasks/{projectTask}/priority', SetTaskPriorityController::class);
        Route::patch('/project-tasks/{projectTask}/status', SetTaskStatusController::class);
    });
});

///////////////////////////////////////////////////////////////////////////////
// Defines the bindings for the User, Project, Task, and ProjectTask models

// User model binding with the UUID: userUuid
// URL: /api/user-uuid/the_user_UUID
Route::bind('userUuid', function (string $value) {
    return Binding::getModel($value, 'users', 'user_not_found');
});

// Project model binding with the UUID: projectUuid
// URL: /api/project-uuid/the_project_UUID
Route::bind('projectUuid', function (string $value) {
    return Binding::getModel($value, 'projects', 'project_not_found');
});

// Task model binding with the UUID: taskUuid
// URL: /api/task-uuid/the_task_UUID
Route::bind('taskUuid', function (string $value) {
    return Binding::getModel($value, 'tasks', 'task_not_found');
});

// ProjectTask model binding with the ID and/or the UUID: projectTask
// URL: /api/project-tasks/project_ID-or-project_UUID,task_ID-or-task_UUID
Route::bind('projectTask', function (string $value) {
    return Binding::getPivot($value);
});
