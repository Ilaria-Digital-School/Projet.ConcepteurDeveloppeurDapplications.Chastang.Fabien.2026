<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatus;
use App\Models\ProjectTask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SetTaskStatusController extends Controller
{
    // Updates the project task status
    public function __invoke(Request $request, ProjectTask $projectTask): JsonResponse
    {
        // Validates the data
        $validated = $request->validate([
            'status' => ['bail', 'required', 'int', Rule::enum(TaskStatus::class)],
        ]);

        // Updates the status
        $projectTask->status = $validated['status'];
        $projectTask->save();

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_updated'),
                'data' => $projectTask
            ]
        );
    }
}
