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
use App\Utilities\Validation;
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
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('projects-uuid', ProjectController::class)
        ->parameters(['projects-uuid' => 'projectUuid']);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('tasks-uuid', TaskController::class)
        ->parameters(['tasks-uuid' => 'taskUuid']);

    // All users: manage project tasks, updates only the "project_uuid" and
    // "task_uuid" columns, and not the "status" and "priority" columns
    // ProjectTask model binding: /api/project-tasks/{projectTask}
    Route::apiResource('project-tasks', ProjectTaskController::class)
        ->parameters(['project-tasks' => 'projectTask']);

    // All users: updating project task "priority"
    Route::patch('/project-tasks/{projectTask}/priority', SetTaskPriorityController::class);

    // Administrators and super-administrators: updating project task "status"
    // But only a super-administrator can revert to a previous status, this
    // functionality is implemented in the controller
    Route::middleware('role:2')->patch('/project-tasks/{projectTask}/status', SetTaskStatusController::class);
});

// Defines the binding for the ProjectTask model
// URL: /api/project-tasks/project-ID-or-project-UUID,task-ID-or-task-UUID
Route::bind('projectTask', function (string $params) {
    [$identProj, $identTask] = array_pad(explode(',', $params, 2), 2, null);

    // If validation or data retrieval fails, an HttpException is thrown

    // Checks if any parameters are missing
    Validation::checkParam($identProj && $identTask, 'parameters_missing');

    if (Validation::isId($identProj)) {
        // Retrieves the project UUID
        $identProj = Binding::getUuid($identProj, 'projects', 'project_not_found');
    } else {
        // Checks if the parameter is a valid UUID
        Validation::checkUuid($identProj);
        // Checks if the project exists
        Validation::checkUuidExists($identProj, 'projects', 'project_not_found');
    }

    if (Validation::isId($identTask)) {
        // Retrieves the project UUID
        $identTask = Binding::getUuid($identTask, 'tasks', 'task_not_found');
    } else {
        // Checks if the parameter is a valid UUID
        Validation::checkUuid($identTask);
        // Checks if the task exists
        Validation::checkUuidExists($identTask, 'tasks', 'task_not_found');
    }

    // Returns the binding for the ProjectTask model
    return Binding::getProjectTask($identProj, $identTask);
});
