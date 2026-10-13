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
            // "project_uuid" => $this->project_uuid,
            // "task_uuid" => $this->task_uuid,
            "status" => $this->status,
            "created_at" => $this->created_at->format('d/m/Y H:i'),
            "updated_at" => $this->updated_at->format('d/m/Y H:i')
        ];
    }
}
