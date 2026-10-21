<?php

namespace App\Http\Requests;

use App\Models\Task;
use App\Utilities\Validation;
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
        // Retrieves the validation conditions
        $rules = Validation::rules(
            $this->method(),
            $this->task instanceof Task ? $this->task->id : $this->task
        );

        return [
            'name'        => "bail{$rules['required']}|min:10|max:255|unique:projects,name{$rules['excluded']}",
            'description' => 'bail|max:1000',
        ];
    }
}
