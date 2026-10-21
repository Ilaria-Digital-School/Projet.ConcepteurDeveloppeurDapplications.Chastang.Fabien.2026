<?php

namespace App\Utilities;

class Validation
{
    public static function rules(string $method, int|string $id): array
    {
        return $method === 'PUT' || $method === 'PATCH'
            // For updates, disable the mandatory fields as well as the uniqueness constraint
            ? ['required' => '', 'excluded' => ",$id,id"]
            // For insertions, enable the mandatory fields as well as the uniqueness constraint
            : ['required' => '|required', 'excluded' => ''];
    }
}
