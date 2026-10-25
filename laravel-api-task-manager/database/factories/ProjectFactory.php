<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

// Extends Factory<Project>
class ProjectFactory extends Factory
{
    // Define the model's default state
    // return array<string, mixed>
    public function definition(): array
    {
        return [
            'name' => fake()->catchPhrase(),
            'description' => fake()->optional(0.8)->paragraph(),
            'created_at' => fake()->dateTimeBetween('-1 year', '-2 month'),
            'updated_at' => fake()->dateTimeBetween('-1 month', '-1 week'),
        ];
    }

    public function withDescription(): static
    {
        return $this->state(fn(array $attributes) => [
            'description' => fake()->paragraph(),
        ]);
    }
}
