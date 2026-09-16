<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosConnection extends Model
{
    protected $fillable = [
        'user_id', 'name', 'base_url', 'api_key', 'license_key', 'active', 'last_synced_at',
    ];

    protected $hidden = ['api_key'];

    protected function casts(): array
    {
        return [
            'api_key' => 'encrypted', // تشفير تلقائي بمفتاح APP_KEY
            'active' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
