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
// Defines the binding for the ProjectTask model
// ProjectTask model binding: /api/project-tasks/{projectTask}
// URL: /api/project-tasks/project_ID-or-project_UUID,task_ID-or-task_UUID

Route::bind('projectTask', function (string $value) {
    [$identProj, $identTask] = array_pad(explode(',', $value, 2), 2, null);

    // If validation or data retrieval fails, an HttpException is thrown

    // Checks if any parameters are missing
    Validation::checkParam($identProj && $identTask);

    if (Validation::isId($identProj)) {
        // Retrieves the project UUID
        $identProj = Binding::getUuidById($identProj, 'projects', 'project_not_found');
    } else {
        // Checks if the parameter is a valid UUID
        Validation::checkUuid($identProj);
        // Checks if the project exists
        Validation::checkUuidExists($identProj, 'projects', 'uuid', 'project_not_found');
    }

    if (Validation::isId($identTask)) {
        // Retrieves the project UUID
        $identTask = Binding::getUuidById($identTask, 'tasks', 'task_not_found');
    } else {
        // Checks if the parameter is a valid UUID
        Validation::checkUuid($identTask);
        // Checks if the task exists
        Validation::checkUuidExists($identTask, 'tasks', 'uuid', 'task_not_found');
    }

    // Returns the binding for the ProjectTask model
    return Binding::getPivotByUuids($identProj, $identTask);
});

///////////////////////////////////////////////////////////////////////////////
// Defines the binding for the Project model
// Project model binding: /api/project-uuid/{projectUuid}
// URL: /api/project-uuid/the_project_UUID

Route::bind('projectUuid', function (string $value) {
    $uuid = $value ?: null;

    // If validation or data retrieval fails, an HttpException is thrown

    // Checks if any parameters are missing
    Validation::checkParam($uuid);

    // Checks if the parameter is a valid UUID
    Validation::checkUuid($uuid);

    // If the project exists, returns the binding for the Project model
    return Binding::getModelByUuid($uuid, 'projects', 'project_not_found');
});

///////////////////////////////////////////////////////////////////////////////
// Defines the binding for the Task model
// Task model binding: /api/tasks-uuid/{taskUuid}
// URL: /api/task-uuid/the_task_UUID

Route::bind('taskUuid', function (string $value) {
    $uuid = $value ?: null;

    // If validation or data retrieval fails, an HttpException is thrown

    // Checks if any parameters are missing
    Validation::checkParam($uuid);

    // Checks if the parameter is a valid UUID
    Validation::checkUuid($uuid);

    // If the task exists, returns the binding for the Task model
    return Binding::getModelByUuid($uuid, 'tasks', 'task_not_found');
});
