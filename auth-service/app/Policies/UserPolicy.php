<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function view(User $user)
    {
        return $user->hasPermission('view-users');
    }

    public function create(User $user)
    {
        return $user->hasPermission('create-user');
    }

    public function update(User $user, User $targetUser)
    {
        return $user->hasPermission('edit-user') || $user->id === $targetUser->id;
    }

    public function delete(User $user, User $targetUser)
    {
        return $user->hasPermission('delete-user');
    }

    public function resetPassword(User $user, User $targetUser)
    {
        return $user->hasPermission('edit-user') || $user->id === $targetUser->id;
    }

    public function viewRoles(User $user)
    {
        return $user->hasPermission('view-roles');
    }
}
