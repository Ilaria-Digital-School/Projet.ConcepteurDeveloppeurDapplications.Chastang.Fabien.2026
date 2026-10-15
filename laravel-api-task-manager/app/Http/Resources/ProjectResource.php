<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    // Transform the resource into an array
    // return array<string, mixed>
    public function toArray(Request $request): array
    {
        return [
            "id"          => $this->id,
            "uuid"        => $this->uuid,
            "name"        => $this->name,
            "description" => $this->description,
            "created_at"  => $this->created_at->format('d/m/Y H:i'),
            'tasks'       => TaskResource::collection($this->whenLoaded('tasks')),
            'status'      => $this->whenPivotLoaded('project_tasks', fn() => $this->pivot->status),
            'status_date' => $this->whenPivotLoaded(
                'project_tasks',
                fn() => ($this->pivot->updated_at ?? $this->pivot->created_at)->format('d/m/Y H:i')
            ),
        ];
    }
}
