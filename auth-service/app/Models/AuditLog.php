<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'actor_id',
        'session_id',
        'actor_name',
        'action',
        'target_id',
        'target_type',
        'target',
        'changes',
    ];

    protected $casts = [
        'target' => 'array',
        'changes' => 'array',
    ];
}
