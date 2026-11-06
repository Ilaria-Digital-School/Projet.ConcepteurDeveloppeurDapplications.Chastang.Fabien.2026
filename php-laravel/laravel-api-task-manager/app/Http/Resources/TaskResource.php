<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    // Transform the resource into an array
    // return array<string, mixed>
    public function toArray(Request $request): array
    {
        return [
            "id"          => $this->id,
            "uuid"        => $this->uuid,
            "title"       => $this->title,
            "description" => $this->description,
            "created_at"  => $this->created_at->format('d/m/Y H:i'),
            'projects'    => ProjectResource::collection($this->whenLoaded('projects')),
            'status'      => $this->whenPivotLoaded(
                'project_tasks',
                fn() => [
                    'value' => $this->pivot->status->value,
                    'label' => $this->pivot->status->label(),
                ]
            ),
            'priority'      => $this->whenPivotLoaded(
                'project_tasks',
                fn() => [
                    'value' => $this->pivot->priority->value,
                    'label' => $this->pivot->priority->label(),
                ]
            ),
            'project_task_date' => $this->whenPivotLoaded(
                'project_tasks',
                fn() => ($this->pivot->updated_at ?? $this->pivot->created_at)->format('d/m/Y H:i')
            ),
        ];
    }
}
