<?php

namespace App\Http\Requests;

use App\Enums\TaskStatus;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

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
        // Error: project not found
        abort_if(
            Project::where('project_uuid', $this->project_uuid)->count() === 0,
            Response::HTTP_NOT_FOUND,
            __('messages.project_not_found')
        );

        // Error: task not found
        abort_if(
            Task::where('task_uuid', $this->task_uuid)->count() === 0,
            Response::HTTP_NOT_FOUND,
            __('messages.task_not_found')
        );

        // Uniqueness constraint on the combination
        // of the project_uuid and task_uuid columns
        $unicity = '|unique:project_tasks,task_uuid,NULL,task_uuid,project_uuid,'
            . $this->project_uuid;

        return [
            'project_uuid' => 'bail|required|uuid|exists:projects,uuid',
            'task_uuid' => 'bail|required|uuid|exists:tasks,uuid' . $unicity,
        ];
    }
}
