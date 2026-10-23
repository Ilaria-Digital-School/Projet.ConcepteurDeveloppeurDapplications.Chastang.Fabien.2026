<?php

namespace App\Utilities;

class Validation
{
    // The password must contain at least 10 characters, all non-whitespace, including at least
    // one lowercase letter, one uppercase letter, one digit, and one special character
    const SPECIAL_CHARS = '&~#"\'{([|_\\\\^@)\\]=+}€¨$£¤%*<>,?;.:\\/!§-';
    const PSWD_PATTERN = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[' .
        self::SPECIAL_CHARS . '])[a-zA-Z\\d' . self::SPECIAL_CHARS . ']{10,}$/';

    public static function rules(string $method, int|string $id): array
    {
        return $method === 'PUT' || $method === 'PATCH'
            // For updates, disable the mandatory fields as well as the uniqueness constraint
            ? ['required' => '', 'excluded' => ",$id,id"]
            // For insertions, enable the mandatory fields as well as the uniqueness constraint
            : ['required' => '|required', 'excluded' => ''];
    }

    public static function rulesPassword(string $method, bool $confirmation): array
    {
        if ($method === 'PUT' || $method === 'PATCH')
            $pswdRules = ['bail', 'min:10'];
        else
            $pswdRules = ['bail', 'required', 'min:10'];

        $pswdRules[] = 'regex:' . self::PSWD_PATTERN;
        if ($confirmation) $pswdRules[] = 'confirmed';

        return $pswdRules;
    }
}
