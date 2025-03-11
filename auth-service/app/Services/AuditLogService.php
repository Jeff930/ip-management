<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Log;

class AuditLogService
{
    public static function logAction(array $data)
    {
        try {
            AuditLog::create([
                'actor_id'   => $data['actor_id'] ?? null,
                'session_id' => $data['session_id'] ?? null,
                'actor_name' => $data['actor_name'] ?? null,
                'action'     => $data['action'],
                'target_id'  => $data['target_id'] ?? null,
                'target_type'=> $data['target_type'] ?? null,
                'target'     => $data['target'] ?? null,
                'changes'    => $data['changes'] ?? [],
            ]);

            Log::info("✔️ Log action recorded successfully", $data);
        } catch (\Exception $e) {
            Log::error("❌ Failed to log action: " . $e->getMessage());
        }
    }
}
