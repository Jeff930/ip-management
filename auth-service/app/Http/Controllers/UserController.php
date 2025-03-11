<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Services\AuditLogService;

class UserController extends Controller
{
    public function index()
    {
        if (auth()->user()->cannot('view', User::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return User::orderBy('id', 'desc')->get()->append('role_name');
    }
    
    public function store(Request $request)
    {
        if (auth()->user()->cannot('create', User::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
            'role'     => 'required|exists:roles,id',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role_id'  => $request->role,
        ]);

        $roleName = Role::find($request->role)->name;

        AuditLogService::logAction([
            'actor_id'    => auth()->id(),
            'session_id'  => auth()->user()->session_id,
            'actor_name'  => auth()->user()->name,
            'action'      => 'USER CREATED',
            'target_id'   => $user->id,
            'target_type' => 'User',
            'changes'     => $user->toArray(),
        ]);

        return response()->json([
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role_id'    => $user->role_id,
            'role_name'  => $roleName,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ]);
    }

    public function update(Request $request, User $user)
    {
        if (auth()->user()->cannot('update', $user)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role'  => 'required|exists:roles,id',
        ]);

        $originalData = $user->only(['name', 'email', 'role_id']);
        $user->update([
            'name'    => $validated['name'],
            'email'   => $validated['email'],
            'role_id' => $validated['role'],
        ]);

        AuditLogService::logAction([
            'actor_id'    => auth()->id(),
            'session_id'  => auth()->user()->session_id,
            'actor_name'  => auth()->user()->name,
            'action'      => 'USER UPDATED',
            'target_id'   => $user->id,
            'target_type' => 'User',
            'changes'     => array_diff_assoc($user->only(['name', 'email', 'role_id']), $originalData),
        ]);

        return response()->json([
            'message' => 'User updated successfully',
            'user'    => $user->fresh()->toArray(),
        ]);
    }

    public function destroy(User $user)
    {
        if (auth()->user()->cannot('delete', $user)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $userId = $user->id;
        $userName = $user->name;
        $user->delete();

        AuditLogService::logAction([
            'actor_id'    => auth()->id(),
            'session_id'  => auth()->user()->session_id,
            'actor_name'  => auth()->user()->name,
            'action'      => 'USER DELETED',
            'target_id'   => $userId,
            'target_type' => 'User',
            'changes'     => ['name' => $userName],
        ]);

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function resetPassword(Request $request, User $user)
    {
        if (auth()->user()->cannot('resetPassword', $user)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        AuditLogService::logAction([
            'actor_id'    => auth()->id(),
            'session_id'  => auth()->user()->session_id,
            'actor_name'  => auth()->user()->name,
            'action'      => 'PASSWORD RESET',
            'target_id'   => $user->id,
            'target_type' => 'User',
        ]);

        return response()->json(['message' => 'Password reset successfully']);
    }
}
