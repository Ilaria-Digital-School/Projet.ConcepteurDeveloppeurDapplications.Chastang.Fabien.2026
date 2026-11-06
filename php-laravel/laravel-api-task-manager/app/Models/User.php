<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Override;

#[Fillable(['name', 'email', 'password'])] // Whitelist, more secure
#[Hidden(['password'])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    // Default value ​​used during creation, so that these
    // value ​​can be retrieved when the result is displayed
    protected $attributes = [
        'role' => UserRole::User->value,
    ];

    // Get the attributes that should be cast
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'role'              => UserRole::class,
        ];
    }

    // Automatically inserts a UUID when creating a user
    #[Override]
    public function uniqueIds(): array
    {
        return ['uuid'];
    }
}
