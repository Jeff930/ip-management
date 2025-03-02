<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Support\Str;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'role_id',
        'password',
        'session_id',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'user_id' => $this->id,
            'user_name' => $this->name,
            'email' => $this->email,
            'role_name' => $this->role->name ?? null,
            'permissions' => $this->role->permissions->pluck('name')->toArray() ?? [],
            'session_id' => $this->session_id,
        ];
    }

    public function hasPermission($permission)
    {
        return $this->role->permissions()->where('name', $permission)->exists();
    }

    public function getRoleNameAttribute()
    {
        return $this->role ? $this->role->name : null;
    }
}
