<?php

namespace App\Models;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTask extends Pivot
{
    // Pivot table
    protected $table = 'project_tasks';

    // No auto-incrementing id column
    public $incrementing = false;

    // Protected column: status
    protected $guarded = ['status'];

    // Default values ​​used during creation, so that these
    // values ​​can be retrieved when the result is displayed
    protected $attributes = [
        'status'   => TaskStatus::Pending->value,
        'priority' => TaskPriority::Medium->value,
    ];

    // Relationship with the "projects" table
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_uuid', 'uuid');
    }

    // Relationship with the "tasks" table
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_uuid', 'uuid');
    }

    // Set the keys for a save update query
    protected function setKeysForSaveQuery($query)
    {
        return $query
            ->where('project_uuid', $this->getOriginal('project_uuid', $this->project_uuid))
            ->where('task_uuid', $this->getOriginal('task_uuid', $this->task_uuid));
    }

    // Get the query builder for a delete operation on the pivot
    protected function getDeleteQuery()
    {
        return $this->newQueryWithoutRelationships()
            ->where('project_uuid', $this->project_uuid)
            ->where('task_uuid', $this->task_uuid);
    }

    // Get the attributes that should be cast
    protected function casts(): array
    {
        return [
            'status'   => TaskStatus::class,
            'priority' => TaskPriority::class,
        ];
    }
}
