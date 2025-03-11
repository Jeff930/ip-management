<?php

namespace App\Policies;

use App\Models\User;

class AuditLogPolicy
{
    public function view(User $user)
    {
        return $user->hasPermission('view-roles');
    }
}
