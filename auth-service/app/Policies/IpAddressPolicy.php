<?php

namespace App\Policies;

use App\Models\IpAddress;
use App\Models\User;
use Illuminate\Auth\Access\Response;


class IpAddressPolicy
{
    public function update(User $user, IpAddress $ipAddress)
    {
        return $user->id === $ipAddress->user_id || $user->role === 'admin';
    }

    public function delete(User $user, IpAddress $ipAddress)
    {
        return $user->id === $ipAddress->user_id || $user->role === 'admin';
    }
}