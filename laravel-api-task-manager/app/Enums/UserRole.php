<?php

namespace App\Enums;

enum UserRole: int
{
    case User       = 1;
    case Admin      = 2;
    case SuperAdmin = 3;

    public function label(): string
    {
        return match ($this) {
            self::User       => __('enums.role_user'),
            self::Admin      => __('enums.role_admin'),
            self::SuperAdmin => __('enums.role_super_admin'),
        };
    }
}
