<?php

namespace Database\Seeders;

use App\Models\ProjectTask;
use Database\Factories\Utilities;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class ProjectTaskSeeder extends Seeder
{
    private const NTASKS = 4;

    // Run the database seeds
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        ProjectTask::truncate();
        Schema::enableForeignKeyConstraints();

        $projects = Utilities::projectUuids();
        $tasks = Utilities::taskUuids();

        foreach ($projects as $project) {
            [$_tasks, $ntasks] = [$tasks, random_int(1, self::NTASKS)];

            for ($i = 0; $i < $ntasks; $i++) {
                $taskUuid = fake()->randomElement($_tasks)->uuid;
                $_tasks = $_tasks->filter(fn($task) => $task->uuid !== $taskUuid);

                ProjectTask::factory()->create([
                    'project_uuid' => $project->uuid,
                    'task_uuid' => $taskUuid,
                ]);
            }
        }
    }
}
