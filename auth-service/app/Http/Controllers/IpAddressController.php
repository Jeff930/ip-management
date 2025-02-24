<?php

namespace App\Http\Controllers;

use App\Models\IpAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IpAddressController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'ip_address' => 'required|ip',
            'label' => 'required|string|max:255',
            'comment' => 'nullable|string',
        ]);

        $ip = IpAddress::create([
            'user_id' => Auth::id(),
            'ip_address' => $request->ip_address,
            'label' => $request->label,
            'comment' => $request->comment,
        ]);

        return response()->json($ip, 201);
    }

    public function index()
    {
        return IpAddress::all();
    }

    public function update(Request $request, IpAddress $ipAddress)
    {
        $request->validate([
            'ip_address' => 'sometimes|ip', 
            'label' => 'sometimes|string|max:255',
            'comment' => 'nullable|string',
        ]);

        $updates = [];

        if ($request->has('label')) {
            $updates['label'] = $request->label;
        }

        if (Auth::user()->can('update', $ipAddress)) {
            if ($request->has('comment')) {
                $updates['comment'] = $request->comment;
            }
            if ($request->has('ip_address')) {
                $updates['ip_address'] = $request->ip_address;
            }
        }

        if (empty($updates)) {
            return response()->json(['message' => 'No valid fields to update'], 400);
        }

        $ipAddress->update($updates);

        return response()->json($ipAddress);
    }

    public function destroy(IpAddress $ipAddress)
    {
        if (Auth::user()->cannot('delete', $ipAddress)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ipAddress->delete();

        return response()->json(['message' => 'IP address deleted successfully.']);
    }
}
