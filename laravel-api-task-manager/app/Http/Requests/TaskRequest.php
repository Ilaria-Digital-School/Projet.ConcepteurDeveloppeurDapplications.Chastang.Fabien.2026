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

        $required = '|required';
        $excluded = '';
        if ($this->method() === 'PUT') {
            // Disables mandatory fields for updates
            $required = '';
            // Disables the name uniqueness constraint for the project being updated
            $excluded = ",$id,id";
        }

        return [
            'name' => "bail$required|min:10|max:255|unique:projects,name$excluded",
            'description' => 'bail|max:1000',
        ];
    }
}
