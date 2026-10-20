<?php

namespace App\Http\Requests;

use App\Models\User;
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
        // Retrieves the ID of the user to be updated
        $id = $this->user instanceof User ? $this->user->id : $this->user;

        $required = '|required';
        $excluded = '';
        if ($this->method() === 'PUT') {
            // Disables mandatory fields for updates
            $required = '';
            // Disables the email uniqueness constraint for the user email being updated
            $excluded = ",$id,id";
        }

        $rules = [
            'name' => "bail$required|min:3|max:100",
            'password' => "bail$required|min:8|confirmed",
            'email' => "bail$required|email|max:255|unique:users,email$excluded",
        ];

        return $rules;
    }
}
