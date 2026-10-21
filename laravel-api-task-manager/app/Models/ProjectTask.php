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

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_uuid', 'uuid');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_uuid', 'uuid');
    }

    // Query used by save()
    protected function setKeysForSaveQuery($query)
    {
        return $query
            ->where('project_uuid', $this->getOriginal('project_uuid', $this->project_uuid))
            ->where('task_uuid', $this->getOriginal('task_uuid', $this->task_uuid));
    }

    // Query used by delete()
    protected function getDeleteQuery()
    {
        return $this->newQueryWithoutRelationships()
            ->where('project_uuid', $this->project_uuid)
            ->where('task_uuid', $this->task_uuid);
    }

    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'priority' => TaskPriority::class,
        ];
    }
}
