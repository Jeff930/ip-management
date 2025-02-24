<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IpAddress extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'ip_address', 'label', 'comment'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
