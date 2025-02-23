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
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class)->except(['create', 'edit']);
    Route::apiResource('ip-addresses', IpAddressController::class)->except(['create', 'edit']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
