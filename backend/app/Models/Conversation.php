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
     * Boot Method: معالجة أحداث دورة حياة الموديل
     */
    protected static function booted(): void
    {
        // 1. تعيين قيم افتراضية قبل الحفظ لحماية قاعدة البيانات من قيم null
        static::creating(function (Conversation $conversation) {
            $conversation->customer_name = $conversation->customer_name ?: 'عميل جديد';
            $conversation->category = $conversation->category ?: 'عام';
            $conversation->last_message = $conversation->last_message ?: 'بدء محادثة جديدة';
            $conversation->last_message_at = $conversation->last_message_at ?: now();
        });

        // 2. إنشاء أول رسالة تلقائياً فقط عند الإنشاء اليدوي من Filament وتجاهل طلبات API/n8n لمنع التكرار
        static::created(function (Conversation $conversation) {
            if (
                $conversation->last_message &&
                $conversation->messages()->count() === 0 &&
                !request()->is('api/*')
            ) {
                $conversation->messages()->create([
                    'direction' => 'in',
                    'text'      => $conversation->last_message,
                    'via'       => 'whatsapp',
                ]);
            }
        });
    }

    /**
     * علاقة المستخدم مع Null Object Pattern
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