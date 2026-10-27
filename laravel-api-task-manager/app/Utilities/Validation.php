<?php

namespace App\Utilities;

use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class Validation
{
    // The password must contain at least 10 characters, all non-whitespace, including at least
    // one lowercase letter, one uppercase letter, one digit, and one special character
    const SPECIAL_CHRS = '&~#"\'{([|_\\\\^@)\\]=+}€¨$£¤%*<>,?;.:\\/!§-';
    const PSWD_PATTERN = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[' .
        self::SPECIAL_CHRS . '])[a-zA-Z\\d' . self::SPECIAL_CHRS . ']{10,}$/';

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

    public static function isId(string $id): bool
    {
        return Validator::make(
            ['id' => $id],
            ['id' => ['int', 'min:1']]
        )->passes();
    }

    public static function checkParam(bool $valid): void
    {
        abort_unless(
            $valid,
            Response::HTTP_BAD_REQUEST,
            __('messages.parameters_missing')
        );
    }

    public static function checkUuid(string $uuid): void
    {
        abort_if(
            Validator::make(
                ['uuid' => $uuid],
                ['uuid' => ['uuid']]
            )->fails(),
            Response::HTTP_BAD_REQUEST,
            __('messages.uuid_invalid')
        );
    }

    public static function checkUuidExists(
        string $uuid,
        string $table,
        string $column,
        string $messagesKey,
        bool $abortExist = false
    ): void {
        $exists = Validator::make(
            ['uuid' => $uuid],
            ['uuid' => ["exists:$table,$column"]]
        )->passes();

        abort_if(
            ($abortExist && $exists) || (!$abortExist && !$exists),
            $abortExist ? Response::HTTP_BAD_REQUEST : Response::HTTP_NOT_FOUND,
            __("messages.$messagesKey")
        );
    }
}
