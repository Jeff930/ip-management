<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User registered successfully']);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = auth()->user();
        $user->session_id = Str::uuid(); 
        $user->save();

        $token = JWTAuth::fromUser($user);

        return $this->respondWithToken($token);
    }

    public function me(Request $request)
    {
        $user = auth()->user()->load('role.permissions'); 

        return response()->json(auth()->user());
    }

    public function logout()
    {
        $user = auth()->user();
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
        'user'         => $user,
        'session_id'   => $user->session_id ?? null,
    ]);
}


    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
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

        return response()->json(['message' => 'Password updated successfully']);
    }
}
