<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatus;
use App\Enums\UserRole;
use App\Models\ProjectTask;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
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

        // Get the user making the request
        $user = $request->user();
        if (
            $projectTask->status > $validated['status']
            && $user->role->value < UserRole::SuperAdmin->value
        ) {
            // Error: only a super-administrator can revert to a previous status
            return $this->jsonError('prev_status_unauthorized', Response::HTTP_UNAUTHORIZED);
        }

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
