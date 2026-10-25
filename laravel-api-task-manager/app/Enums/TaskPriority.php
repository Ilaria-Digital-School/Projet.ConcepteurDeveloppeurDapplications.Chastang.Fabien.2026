<?php

namespace App\Enums;

enum TaskPriority: int
{
    case Low    = 1;
    case Medium = 2;
    case High   = 3;

    public function label(): string
    {
        return match ($this) {
            self::Low    => __('enums.priority_low'),
            self::Medium => __('enums.priority_medium'),
            self::High   => __('enums.priority_high'),
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
