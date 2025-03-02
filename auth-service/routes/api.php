<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\IpAddressController;
use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;


Route::get('/check', function () {
    return response()->json(['message' => 'Auth API is working!']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::middleware('jwt')->group(function () {
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
        Route::put('/{user}', [UserController::class, 'update']);
        Route::put('/reset-password/{user}', [UserController::class, 'resetPassword']);
    });
    Route::prefix('profile')->group(function () {
        Route::get('/', [AuthController::class, 'me']);
        Route::put('/change-password', [AuthController::class, 'changePassword']);
        Route::put('/update', [AuthController::class, 'updateProfile']);
    });
    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/ip-addresses', [IpAddressController::class, 'index']);
    Route::post('/ip-addresses', [IpAddressController::class, 'store']);
    Route::delete('/ip-addresses/{ipAddress}', [IpAddressController::class, 'destroy']);
    Route::put('/ip-addresses/{ipAddress}', [IpAddressController::class, 'update']); 
    Route::post('/logout', [AuthController::class, 'logout']);
});

