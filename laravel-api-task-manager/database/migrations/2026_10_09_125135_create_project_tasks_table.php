<?php

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
            $table->enum('status', ['pending', 'in_progress', 'done'])->default('pending')->index();
            $table->timestamps();
            // Uniqueness condition and foreign keys
            $table->unique(['project_uuid', 'task_uuid']);
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
