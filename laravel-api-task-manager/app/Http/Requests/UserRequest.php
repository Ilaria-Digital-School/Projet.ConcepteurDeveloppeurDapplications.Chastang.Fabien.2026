<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
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

        // Constraint on the email column
        $ruleEmail = 'bail|required|email|max:150|unique:users,email';
        // Disables the email uniqueness constraint for the user email being updated
        if ($this->method() === 'PUT') $ruleEmail .= ",$id,id";

        $rules = [
            'name' => 'bail|required|min:3|max:50',
            'password' => 'bail|required|min:6|confirmed',
            'email' => $ruleEmail,
        ];

        return $rules;
    }
}
