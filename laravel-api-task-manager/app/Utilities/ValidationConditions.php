<?php

namespace App\Utilities;

class ValidationConditions
{
    public static function get(string $method, int|string $id): array
    {
        [$required, $excluded] = ['|required', ''];

        if ($method === 'PUT' || $method === 'PATCH') {
            // Disables mandatory fields for updates
            $required = '';
            // Disables the uniqueness constraint for the row currently being updated
            $excluded = ",$id,id";
        }

        return ['required' => $required, 'excluded' => $excluded];
    }
}
