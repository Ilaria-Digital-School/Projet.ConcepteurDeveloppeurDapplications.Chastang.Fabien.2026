<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Collection;

class Utilities
{
    private const NUSERS = 6;
    private const NPROJECTS = 4;
    private const NTASKS = 10;

    public static function userUuids(): Collection
    {
        return  User::latest()->limit(self::NUSERS)->get('uuid');
    }

    public static function projectUuids(): Collection
    {
        return  Project::latest()->limit(self::NPROJECTS)->get('uuid');
    }

    public static function taskUuids(): Collection
    {
        return  Task::latest()->limit(self::NTASKS)->get('uuid');
    }
}
