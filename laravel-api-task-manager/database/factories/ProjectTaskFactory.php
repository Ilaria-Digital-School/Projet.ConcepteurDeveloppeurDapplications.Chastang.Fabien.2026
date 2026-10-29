<?php

namespace Database\Factories;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

// Extends Factory<ProjectTask>
class ProjectTaskFactory extends Factory
{
    // Define the model's default state
    // return array<string, mixed>
    public function definition(): array
    {
        $uuidUsers = User::latest()->take(6)->pluck('uuid')->toArray();
        return [
            'status'     => fake()->randomElement(TaskStatus::values()),
            'priority'   => fake()->randomElement(TaskPriority::values()),
            'user_uuid'  => fake()->randomElement($uuidUsers),
            'created_at' => fake()->dateTimeBetween('-6 days', '-4 days'),
            'updated_at' => fake()->dateTimeBetween('-3 days', 'now'),
        ];
    }
}
