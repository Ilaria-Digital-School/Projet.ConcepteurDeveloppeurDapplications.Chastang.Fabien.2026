<?php

namespace Database\Seeders;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use App\Models\ProjectTask;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class ProjectTaskSeeder extends Seeder
{
    const NTASKS = 4;

    // Run the database seeds
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        ProjectTask::truncate();
        Schema::enableForeignKeyConstraints();

        $projects = Project::all(['uuid']);
        $tasks = Task::all(['uuid']);

        foreach ($projects as $project) {
            $_tasks = $tasks;
            $ntasks = random_int(1, self::NTASKS);

            for ($i = 1; $i <= $ntasks; $i++) {
                $uuidTask = fake()->randomElement($_tasks)->uuid;
                $_tasks = $_tasks->filter(fn($task) => $task->uuid !== $uuidTask);

                ProjectTask::factory()->create([
                    'project_uuid' => $project->uuid,
                    'task_uuid' => $uuidTask,
                ]);
            }
        }
    }
}
