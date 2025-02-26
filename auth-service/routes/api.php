<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\IpAddressController;
use Illuminate\Support\Facades\Route;

Route::get('/check', function () {
    return response()->json(['message' => 'Auth API is working!']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::middleware('jwt')->group(function () {
    Route::get('/ip-addresses', [IpAddressController::class, 'index']);
    Route::post('/ip-addresses', [IpAddressController::class, 'store']);
    Route::middleware('role:admin')->group(function () {
        Route::delete('/ip-addresses/{ipAddress}', [IpAddressController::class, 'destroy']);
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::put('/users/reset-password/{user}', [UserController::class, 'resetPassword']);
    });
    // Route::put('/users/{user}/profile', [UserController::class, 'update'])
    //     ->middleware('can:update,user');
    Route::put('/update-profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/ip-addresses/{ipAddress}', [IpAddressController::class, 'update']); 
    Route::post('/logout', [AuthController::class, 'logout']);
});

