<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatus;
use App\Enums\UserRole;
use App\Http\Resources\ProjectTaskResource;
use App\Models\ProjectTask;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class SetTaskStatusController extends Controller
{
    // Updates the project task status
    public function __invoke(Request $request, ProjectTask $projectTask): JsonResponse
    {
        // Validates the data
        $validated = $request->validate([
            'status' => ['bail', 'required', 'int', Rule::enum(TaskStatus::class)],
        ]);

        // Only a super-administrator can revert to a previous status
        if (
            $projectTask->status > $validated['status']
            && $request->user()->role->value < UserRole::SuperAdmin->value
        ) {
            return $this->jsonError('prev_status_unauthorized', Response::HTTP_UNAUTHORIZED);
        }

        // Updates the status
        $projectTask->status = $validated['status'];
        $projectTask->save();

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_updated'),
                'data' => ProjectTaskResource::make($projectTask->load(['project', 'task']))
            ]
        );
    }
}
