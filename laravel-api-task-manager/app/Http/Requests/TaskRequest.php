<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Contracts\Validation\ValidationRule;
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

        // Constraint on the name column
        $ruleName = 'bail|required|min:10|max:255|unique:projects,name';
        // Disables the email uniqueness constraint for the user email being updated
        if ($this->method() === 'PUT') $ruleName .= ",$id,id";

        $rules = [
            'name' => $ruleName,
            'description' => 'bail|max:1000',
        ];

        return $rules;
    }
}
