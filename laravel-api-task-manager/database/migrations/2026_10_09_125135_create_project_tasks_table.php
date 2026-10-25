<?php

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run the migrations
    public function up(): void
    {
        // SQL pivot table
        Schema::create('project_tasks', function (Blueprint $table) {
            $table->uuid('project_uuid')->index();
            $table->uuid('task_uuid')->index();
            $table->enum('status', TaskStatus::values())
                ->default(TaskStatus::Pending->value)
                ->index();
            $table->enum('priority', TaskPriority::values())
                ->default(TaskPriority::Medium->value)
                ->index();
            $table->timestamps();
            // Primary key and foreign keys
            $table->primary(['project_uuid', 'task_uuid']);
            $table->foreign('project_uuid')->references('uuid')->on('projects')->cascadeOnDelete();
            $table->foreign('task_uuid')->references('uuid')->on('tasks')->cascadeOnDelete();
        });
    }

    // Reverse the migrations
    public function down(): void
    {
        Schema::dropIfExists('project_tasks');
    }
};
