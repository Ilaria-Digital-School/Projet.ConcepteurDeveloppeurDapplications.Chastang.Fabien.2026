<?php

namespace Database\Factories;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

// Extends Factory<ProjectTask>
class ProjectTaskFactory extends Factory
{
    // Define the model's default state
    // return array<string, mixed>
    public function definition(): array
    {
        return [
            'status' => fake()->randomElement(array_column(TaskStatus::cases(), 'value')),
            'priority' => fake()->randomElement(array_column(TaskPriority::cases(), 'value')),
            'created_at' => fake()->dateTimeBetween('-6 days', '-4 days'),
            'updated_at' => fake()->dateTimeBetween('-3 days', 'now'),
        ];
    }
}
