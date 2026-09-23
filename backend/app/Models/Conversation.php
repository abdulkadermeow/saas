<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
        'user_id',
        'customer_name',
        'phone',
        'category',
        'last_message',
        'last_message_at',
        'unread',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
            'unread' => 'boolean',
        ];
    }

    /**
     * علاقة المستخدم مع حماية ضد القيمة الفارغة null
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withDefault([
            'name' => 'غير محدد',
        ]);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}