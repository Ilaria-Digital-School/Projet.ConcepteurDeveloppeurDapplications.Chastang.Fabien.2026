<?php

namespace App\Http\Controllers;

use App\Enums\TaskPriority;
use App\Http\Resources\ProjectTaskResource;
use App\Models\ProjectTask;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SetTaskPriorityController extends Controller
{
    // Updates the project task priority
    public function __invoke(Request $request, ProjectTask $projectTask)
    {
        // Validates the data
        $validated = $request->validate([
            'priority' => ['bail', 'required', 'int', Rule::enum(TaskPriority::class)],
        ]);

        // Updates the priority
        $projectTask->update($validated);

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_updated'),
                'data' => ProjectTaskResource::make($projectTask->load(['project', 'task']))
            ]
        );
    }
}
