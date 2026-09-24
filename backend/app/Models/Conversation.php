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
     * Boot Method: معالجة أحداث دورة حياة الموديل (Model Lifecycle Events)
     */
    protected static function booted(): void
    {
        // 1. Pre-creation hook: تعيين القيم الافتراضية قبل حفظ السجل في قاعدة البيانات
        static::creating(function (Conversation $conversation) {
            $conversation->customer_name = $conversation->customer_name ?: 'عميل جديد';
            $conversation->category = $conversation->category ?: 'عام';
            $conversation->last_message = $conversation->last_message ?: 'بدء محادثة جديدة';
            $conversation->last_message_at = $conversation->last_message_at ?: now();
        });

        // 2. Post-creation hook: إنشاء أول رسالة تلقائياً داخل جدول messages فور حفظ المحادثة
       static::created(function (Conversation $conversation) {
    if ($conversation->last_message && $conversation->messages()->count() === 0) {
        $conversation->messages()->create([
            'direction' => 'in',   // ← كان 'from' (غلط)
            'text'      => $conversation->last_message,
            'via'       => 'whatsapp',
            
        ]);
    }
});
    }

    /**
     * علاقة المستخدم مع حماية Null Object Pattern
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withDefault([
            'name' => 'غير محدد',
        ]);
    }

    /**
     * علاقة الرسائل المرتبطة بالمحادثة
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}