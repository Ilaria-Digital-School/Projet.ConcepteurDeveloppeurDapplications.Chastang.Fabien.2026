<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectTaskResource extends JsonResource
{
    // Transform the resource into an array
    // return array<string, mixed>
    public function toArray(Request $request): array
    {
        return [
            "project"    => ProjectShortResource::make($this->whenLoaded('project')),
            "task"       => TaskShortResource::make($this->whenLoaded('task')),
            "status"     => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],
            "priority"   => [
                'value' => $this->priority->value,
                'label' => $this->priority->label(),
            ],
            "created_at" => $this->created_at->format('d/m/Y H:i'),
            "updated_at" => $this->updated_at->format('d/m/Y H:i'),
        ];
    }
}
