<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
        'name'                  => 'required|string|max:255',
        'email'                 => 'required|email|unique:users',
        'password'              => 'required|min:6|confirmed',
        'role'                  => 'required|exists:roles,id',
    ]);

    $user = User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => Hash::make($request->password),
        'role_id'  => $request->role,
    ]);

    $roleName = Role::find($request->role)->name;

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

    $user->update([
        'name'    => $validated['name'],
        'email'   => $validated['email'],
        'role_id' => $validated['role'],
    ]);

    $roleName = Role::find($validated['role'])->name;

    return response()->json([
        'message'    => 'User updated successfully',
        'user' => [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role_id'    => $user->role_id,
            'role_name'  => $roleName, 
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ]
    ]);
}

    public function destroy(User $user)
    {
        if (auth()->user()->cannot('delete', $user)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user->delete();
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
            'password' => Hash::make($validated['password'])
        ]);

        return response()->json(['message' => 'Password reset successfully']);
    }
}
