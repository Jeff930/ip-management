<?php

use Illuminate\Support\Facades\Route;

Route::get('/check', function () {
    return response()->json(['message' => 'Auth API is working!']);
});
