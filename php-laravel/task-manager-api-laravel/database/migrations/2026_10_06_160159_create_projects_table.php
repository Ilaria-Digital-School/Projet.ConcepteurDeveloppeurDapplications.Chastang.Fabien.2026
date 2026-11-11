<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run the migrations
    public function up(): void
    {
        // "projects" table
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->uuid('user_uuid')->nullable()->index();
            $table->timestamps();
            // Foreign key
            $table->foreign('user_uuid')->references('uuid')->on('users')->nullOnDelete();
        });
    }

    // Reverse the migrations
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
