<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    // Run the database seeds
    public function run(): void
    {
        User::truncate();
        User::factory(5)->create();

        $users = [
            [
                'name' => 'Bakary',
                'email' => 'bakary@email.com',
                'password' => 'Azerty:123',
            ],
            [
                'name' => 'Islem',
                'email' => 'islem@email.com',
                'password' => 'Azerty:123',
            ],
            [
                'name' => 'Gilbert',
                'email' => 'gilbert@email.com',
                'password' => 'Azerty:123',
            ],
            [
                'name' => 'Rhiannone',
                'email' => 'rhiannone@email.com',
                'password' => 'Azerty:123',
            ],
            [
                'name' => 'Fabien',
                'email' => 'fabien@email.com',
                'password' => 'Azerty:123',
            ],
        ];

        foreach ($users as $user) User::factory()->create($user);
    }
}
