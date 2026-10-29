<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

// Extends Factory<Project>
class TaskFactory extends Factory
{
    // Define the model's default state
    // return array<string, mixed>
    public function definition(): array
    {
        $uuidUsers = User::latest()->take(6)->pluck('uuid')->toArray();
        return [
            'title'       => fake()->sentence(4),
            'description' => fake()->optional(0.6)->paragraph(),
            'user_uuid'   => fake()->randomElement($uuidUsers),
            'created_at'  => fake()->dateTimeBetween('-1 year', '-2 month'),
            'updated_at'  => fake()->dateTimeBetween('-1 month', '-1 week'),
        ];
    }

    public function withDescription(): static
    {
        return $this->state(fn(array $attributes) => [
            'description' => fake()->paragraph(),
        ]);
    }
}
