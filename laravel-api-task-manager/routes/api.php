<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SetUserRoleController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProjectTaskController;
use App\Http\Controllers\SetTaskPriorityController;
use App\Http\Controllers\SetTaskStatusController;
use App\Models\ProjectTask;
use App\Utilities\Validation;
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
    // Updates only the "project_uuid" and "task_uuid" columns, and not the
    // "status" and "priority" columns
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
// URL: /api/project-tasks/project-uuid,task-uuid
Route::bind('projectTask', function (string $params) {
    [$uuidProj, $uuidTask] = array_pad(explode(',', $params, 2), 2, null);

    // If any parameters are missing, throw an HttpException
    Validation::checkParam($uuidProj && $uuidTask, 'parameters_missing');

    // Check whether both parameters are valid UUIDs,
    // if not, throw an HttpException
    Validation::checkUuid($uuidProj);
    Validation::checkUuid($uuidTask);

    // If the project was not found, throw an HttpException
    Validation::checkUuidExists($uuidProj, 'projects', 'project_not_found');

    // If the task was not found, throw an HttpException
    Validation::checkUuidExists($uuidTask, 'tasks', 'task_not_found');

    // If the project task was not found, throw an HttpException
    abort_unless(
        $projectTask = ProjectTask::where('project_uuid', $uuidProj)
            ->where('task_uuid', $uuidTask)
            ->first(),
        Response::HTTP_NOT_FOUND,
        __('messages.project_task_not_found')
    );

    // Returns the binding for the ProjectTask model
    return $projectTask;
});
