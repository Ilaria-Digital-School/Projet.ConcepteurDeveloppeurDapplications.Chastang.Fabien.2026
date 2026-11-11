<?php

namespace App\Enums;

enum TaskStatus: int
{
    case Pending    = 1;
    case InProgress = 2;
    case Done       = 3;

    public function label(): string
    {
        return match ($this) {
            self::Pending    => __('enums.status_pending'),
            self::InProgress => __('enums.status_in_progress'),
            self::Done       => __('enums.status_done'),
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
