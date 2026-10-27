<?php

namespace App\Utilities;

use App\Models\Project;
use App\Models\ProjectTask;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class Binding
{
    public static function getUuidById(int $id, string $table, string $messagesKey): string
    {
        abort_unless(
            $uuid = DB::table($table)->where('id', $id)->first(['uuid'])?->uuid,
            Response::HTTP_NOT_FOUND,
            __("messages.$messagesKey")
        );
        return $uuid;
    }

    public static function getModelByUuid(
        string $uuid,
        string $table,
        string $messagesKey
    ): User|Project|Task {
        $model = match ($table) {
            'users' => User::where('uuid', $uuid)->first(),
            'projects' => Project::where('uuid', $uuid)->first(),
            'tasks' => Task::where('uuid', $uuid)->first(),
            default => null
        };
        abort_unless(
            $model,
            Response::HTTP_NOT_FOUND,
            __("messages.$messagesKey")
        );
        return $model;
    }

    public static function getPivotByUuids(string $uuidProj, string $uuidTask): ProjectTask
    {
        abort_unless(
            $projectTask = ProjectTask::where('project_uuid', $uuidProj)
                ->where('task_uuid', $uuidTask)
                ->first(),
            Response::HTTP_NOT_FOUND,
            __('messages.project_task_not_found')
        );
        return $projectTask;
    }

    public static function getModel(
        string $value,
        string $table,
        string $messagesKey
    ): User|Project|Task {
        $uuid = $value ?: null;

        // If validation or data retrieval fails, an HttpException is thrown

        // Checks if any parameters are missing
        Validation::checkParam($uuid);

        // Checks if the parameter is a valid UUID
        Validation::checkUuid($uuid);

        // If the model exists, return it
        return self::getModelByUuid($uuid, $table, $messagesKey);
    }

    public static function getPivot(string $value): ProjectTask
    {
        [$identProj, $identTask] = array_pad(explode(',', $value, 2), 2, null);

        // If validation or data retrieval fails, an HttpException is thrown

        // Checks if any parameters are missing
        Validation::checkParam($identProj && $identTask);

        if (Validation::isId($identProj)) {
            // Retrieves the project UUID
            $identProj = self::getUuidById((int)$identProj, 'projects', 'project_not_found');
        } else {
            // Checks if the parameter is a valid UUID
            Validation::checkUuid($identProj);
            // Checks if the project exists
            Validation::checkUuidExists($identProj, 'projects', 'uuid', 'project_not_found');
        }

        if (Validation::isId($identTask)) {
            // Retrieves the project UUID
            $identTask = self::getUuidById((int)$identTask, 'tasks', 'task_not_found');
        } else {
            // Checks if the parameter is a valid UUID
            Validation::checkUuid($identTask);
            // Checks if the task exists
            Validation::checkUuidExists($identTask, 'tasks', 'uuid', 'task_not_found');
        }

        // Returns the binding for the ProjectTask model
        return self::getPivotByUuids($identProj, $identTask);
    }
}
