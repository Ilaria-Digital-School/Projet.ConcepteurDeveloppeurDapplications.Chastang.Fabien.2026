<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProjectTask extends Model {
    // A project can be linked to multiple task
    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'tasks', 'uuid');
    }

    // A task can be linked to multiple projects
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'projects', 'uuid');
    }
}
