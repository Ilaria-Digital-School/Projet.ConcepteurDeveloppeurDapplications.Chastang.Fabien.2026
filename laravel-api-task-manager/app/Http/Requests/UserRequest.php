<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Utilities\Validation;
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
        // Retrieves the validation conditions
        $rules = Validation::rules(
            $this->method(),
            $this->user instanceof User ? $this->user->id : $this->user
        );

        return [
            'name'     => "bail{$rules['required']}|min:3|max:100",
            'password' => Validation::rulesPassword($this->method(), true),
            'email'    => "bail{$rules['required']}|email|max:255|unique:users,email{$rules['excluded']}",
        ];
    }
}
