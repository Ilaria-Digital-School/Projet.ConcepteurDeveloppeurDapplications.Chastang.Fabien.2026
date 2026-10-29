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
        // Validates the priority
        $validated = $request->validate([
            'priority' => ['bail', 'required', 'int', Rule::enum(TaskPriority::class)],
        ]);

        if ($request->filled('priority') && $request->priority !== $projectTask->priority)
            // Changes have been made, an update is required
            $projectTask->update($validated);

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_updated'),
                'data' => ProjectTaskResource::make($projectTask->load(['project', 'task']))
            ]
        );
    }
}
