<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatus;
use App\Http\Resources\ProjectTaskResource;
use App\Models\ProjectTask;
use App\Utilities\Validation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\JsonResponse;

class SetTaskStatusController extends Controller
{
    // Updates the project task status
    public function __invoke(Request $request, ProjectTask $projectTask): JsonResponse
    {
        // Validates the status
        $validated = $request->validate([
            'status' => ['bail', 'required', 'int', Rule::enum(TaskStatus::class)],
        ]);

        if ($request->filled('status') && $request->status !== $projectTask->status) {
            // Changes have been made, an update is required

            // Only a super-administrator can revert to a previous status,
            // otherwise, throw an HttpException
            Validation::checkRoleToRevertPreviousStatus(
                $validated['status'],
                $projectTask,
                $request->user()
            );

            // Updates the status
            $projectTask->status = $validated['status'];
            $projectTask->save();
        }

        return $this->jsonResponse(
            [
                'message' => __('messages.project_task_updated'),
                'data' => ProjectTaskResource::make($projectTask->load(['project', 'task']))
            ]
        );
    }
}
