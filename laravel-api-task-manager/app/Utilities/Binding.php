<?php

namespace App\Utilities;

use App\Models\Project;
use App\Models\ProjectTask;
use App\Models\Task;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class Binding
{
    public static function getUuid(string $id, string $table, string $messagesKey): string
    {
        abort_unless(
            $uuid = DB::table($table)->where('id', $id)->first(['uuid'])?->uuid,
            Response::HTTP_NOT_FOUND,
            __("messages.$messagesKey")
        );
        return $uuid;
    }

    public static function getModel(string $uuid, string $table, string $messagesKey): Project|Task
    {
        $model = match ($table) {
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

    public static function getProjectTask(string $uuidProj, string $uuidTask): ProjectTask
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
}
