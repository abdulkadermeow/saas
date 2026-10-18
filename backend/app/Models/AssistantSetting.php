<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssistantSetting extends Model
{
    protected $fillable = [
        'user_id', 'assistant', 'active', 'status', 'tone',
        'prompt', 'draft_prompt', 'skills', 'draft_skills', 'voice', 'working_hours',
    ];

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'skills' => 'array',
            'draft_skills' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}