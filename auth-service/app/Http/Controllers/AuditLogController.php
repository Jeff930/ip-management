<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->user()->cannot('view', User::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $logs = AuditLog::orderBy('created_at', 'desc')->get();

        return response()->json($logs);
    }
}
