<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'user_id', 'plan_id', 'status',
        'messages_total', 'messages_used',
        'gateway', 'gateway_reference', 'renews_at',
    ];

    protected function casts(): array
    {
        return ['renews_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** بيانات الباقة من config/plans.php */
    public function plan(): ?array
    {
        return collect(config('plans.plans'))->firstWhere('id', $this->plan_id);
    }

    public function remainingMessages(): int
    {
        return max(0, $this->messages_total - $this->messages_used);
    }
}
