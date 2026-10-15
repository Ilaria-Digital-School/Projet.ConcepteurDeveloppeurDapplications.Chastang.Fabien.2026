<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
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
        // Retrieves the ID of the user to be updated
        $id = $this->task instanceof Task ? $this->task->id : $this->task;

        // Disables the email uniqueness constraint for the task name being updated
        $selfExcluded = $this->method() === 'PUT' ? ",$id,id" : '';

        return [
            'name' => 'bail|required|min:10|max:255|unique:projects,name' . $selfExcluded,
            'description' => 'bail|max:1000',
        ];
    }
}
