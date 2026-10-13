<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Override;

class Project extends Model
{
    use HasUuids;

    protected $guarded = ['uuid'];

    // A project can be linked to multiple tasks, and a task
    // to multiple projects: many-to-many relationship
    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'project_tasks', 'project_uuid', 'task_uuid', 'uuid', 'uuid');
    }

    public function status(): BelongsToMany
    {
        return $this->belongsToMany(ProjectTask::class, 'project_tasks', 'project_uuid', 'task_uuid', 'uuid', 'uuid');
    }

    // Automatically inserts a UUID when creating a project
    #[Override]
    public function uniqueIds(): array
    {
        return ['uuid'];
    }
}
