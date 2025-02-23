<?php

namespace App\Http\Controllers;

use App\Models\IpAddress;
use Illuminate\Http\Request;

class IpAddressController extends Controller
{
    public function index()
    {
        return IpAddress::with('user:id,name')->get();
    }

    public function show(IpAddress $ipAddress)
    {
        return response()->json($ipAddress);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ip_address' => 'required|ip',
            'label' => 'required|string',
            'comment' => 'nullable|string'
        ]);

        $ip = IpAddress::create([
            'user_id' => auth()->id(),
            'ip_address' => $request->ip_address,
            'label' => $request->label,
            'comment' => $request->comment
        ]);

        return response()->json(['message' => 'IP added successfully', 'ip' => $ip]);
    }

    public function update(Request $request, IpAddress $ipAddress)
    {
        if (auth()->id() !== $ipAddress->user_id && !auth()->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate(['label' => 'required|string']);
        $ipAddress->update(['label' => $request->label]);

        return response()->json(['message' => 'IP updated successfully']);
    }

    public function destroy(IpAddress $ipAddress)
    {
        if (!auth()->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $ipAddress->delete();
        return response()->json(['message' => 'IP deleted successfully']);
    }
}

