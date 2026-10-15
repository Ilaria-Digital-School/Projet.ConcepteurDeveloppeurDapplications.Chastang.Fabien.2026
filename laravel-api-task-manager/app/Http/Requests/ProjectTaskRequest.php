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
        // Uniqueness constraint on the combination
        // of the project_uuid and task_uuid columns
        $unicity = '|unique:project_tasks,task_uuid,NULL,task_uuid,project_uuid,'
            . $this->project_uuid;

        return [
            'project_uuid' => 'bail|required|uuid|exists:projects,uuid',
            'task_uuid' => 'bail|required|uuid|exists:tasks,uuid' . $unicity,
            'status' => 'bail|required|string|in:pending,in_progress,done',
        ];
    }
}
