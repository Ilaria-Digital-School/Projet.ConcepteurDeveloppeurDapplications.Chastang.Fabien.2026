<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Override;

class Task extends Model
{
    use HasUuids;

    protected $guarded = ['uuid'];

    // Relationship with the "project_tasks" pivot table
    // A task can be linked to multiple projects, and a project
    // to multiple tasks: many-to-many relationship
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_tasks', 'task_uuid', 'project_uuid', 'uuid', 'uuid')
            ->using(ProjectTask::class)
            ->withPivot(['status', 'priority'])
            ->withTimestamps();
    }

    // Automatically inserts a UUID when creating a task
    #[Override]
    public function uniqueIds(): array
    {
        return ['uuid'];
    }
}
