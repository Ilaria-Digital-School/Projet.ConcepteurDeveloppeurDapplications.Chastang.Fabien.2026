<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Utilities\ValidationConditions;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
        // Get the conditions
        $conditions = ValidationConditions::get(
            $this->method(),
            $this->user instanceof User ? $this->user->id : $this->user
        );

        return [
            'name' => "bail{$conditions['required']}|min:3|max:100",
            'password' => "bail{$conditions['required']}|min:8|confirmed",
            'email' => "bail{$conditions['required']}|email|max:255|unique:users,email{$conditions['excluded']}",
        ];
    }
}
