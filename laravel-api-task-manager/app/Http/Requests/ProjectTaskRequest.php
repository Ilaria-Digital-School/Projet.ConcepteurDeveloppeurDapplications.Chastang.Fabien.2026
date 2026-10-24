<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectTaskRequest extends FormRequest
{
    // Determine if the user is authorized to make this request
    public function authorize(): bool
    {
        return true;
    }

    // Get the validation rules that apply to the request
    // return array<string, ValidationRule|array<mixed>|string>
    public function rules(): array
    {
        $setProj = $setTask = false;
        $update = $this->method() === 'PUT' || $this->method() === 'PATH';

        $uuidProj = $update ? $this->projectTask->project_uuid : '';
        if ($this->filled('project_uuid') && (!$update || $this->project_uuid !== $uuidProj))
            [$setProj, $uuidProj] = [true, $this->project_uuid];

        $uuidTask = $update ? $this->projectTask->task_uuid : '';
        if ($this->filled('task_uuid') && (!$update || $this->task_uuid !== $uuidTask))
            [$setTask, $uuidTask] = [true, $this->task_uuid];

        if (!$update || $setProj || $setTask) {
            // Required for creation, but not for update
            $required = $update ? '' : '|required';

            // Uniqueness constraint on the combination of the project_uuid and task_uuid columns
            if ($update && !$setTask) {
                $uniProj = "|unique:project_tasks,project_uuid,NULL,project_uuid,task_uuid,$uuidTask";
                $uniTask = "";
            } else {
                $uniProj = "";
                $uniTask = "|unique:project_tasks,task_uuid,NULL,task_uuid,project_uuid,$uuidProj";
            }

            return [
                'project_uuid' => "bail$required|uuid|exists:projects,uuid$uniProj",
                'task_uuid' => "bail$required|uuid|exists:tasks,uuid$uniTask",
            ];
        } else {
            return [];
        }
    }
}
