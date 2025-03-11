<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use App\Services\AuditLogService;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = auth()->user();
        $user->session_id = Str::uuid(); 
        $user->save();

        AuditLogService::logAction([
            'actor_id'   => $user->id,
            'session_id' => $user->session_id,
            'actor_name' => $user->name,
            'action'     => 'LOGIN',
            'target_id'  => $user->id,
            'target'     => 'SELF',
            'target_type'=> 'User',
        ]);

        return $this->respondWithToken($token);
    }

    public function me(Request $request)
    {
        $user = auth()->user()->load('role.permissions'); 
        return response()->json($user);
    }

    public function logout()
    {
        $user = auth()->user();
        
        AuditLogService::logAction([
            'actor_id'   => $user->id,
            'session_id' => $user->session_id,
            'actor_name' => $user->name,
            'action'     => 'LOGOUT',
            'target_id'  => $user->id,
            'target'     => 'SELF',
            'target_type'=> 'User',
        ]);

        $user->session_id = null;
        $user->save();
        
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        try {
            $newToken = auth()->refresh();
            $user = JWTAuth::setToken($newToken)->toUser();
            return $this->respondWithToken($newToken, $user);
        } catch (\PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Token refresh failed'], 401);
        }
    }

    protected function respondWithToken($token, $user = null)
    {
        $user = $user ?? auth()->user();

        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $user->load('role.permissions');

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth()->factory()->getTTL() * 60,
            'user'         => $user
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $changes = [
            'name'  => $request->name !== $user->name ? ['old' => $user->name, 'new' => $request->name] : null,
            'email' => $request->email !== $user->email ? ['old' => $user->email, 'new' => $request->email] : null,
        ];

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
        ]);

        AuditLogService::logAction([
            'actor_id'   => $user->id,
            'session_id' => $user->session_id,
            'actor_name' => $user->name,
            'action'     => 'PROFILE UPDATE',
            'target_id'  => $user->id,
            'target'     => 'SELF',
            'target_type'=> 'User',
            'changes'     => [
                'name'      => $user->name,
                'email'     => $user->email
            ],
        ]);

        return response()->json($user);
    }

    public function changePassword(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 403);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        AuditLogService::logAction([
            'actor_id'   => $user->id,
            'session_id' => $user->session_id,
            'actor_name' => $user->name,
            'action'     => 'PASSWORD CHANGE',
            'target_id'  => $user->id,
            'target'     => 'SELF',
            'target_type'=> 'User',
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function validateToken(Request $request)
    {
        $user = $request->user()->load('role.permissions');
        
        return response()->json([
            'isTokenValid' => true,
            'user' => $user
        ]);
    }
}
