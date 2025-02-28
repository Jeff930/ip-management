<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        if (auth()->user()->cannot('viewRoles', User::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return Role::all();
    }
}
