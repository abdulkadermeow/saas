<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ربط نظام نقاط البيع الخارجي — متاح فقط لباقة الأعمال
        Schema::create('pos_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name')->default('نظام POS');
            $table->string('base_url');                 // رابط الـ API لنظام الـ POS
            $table->text('api_key');                    // مشفّر (encrypted cast)
            $table->string('license_key', 64)->unique(); // مفتاح ترخيص يتحقق منه نظام الـ POS
            $table->boolean('active')->default(true);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_id')->nullable()->constrained()->nullOnDelete();
            $table->string('gateway');                  // stripe | manual
            $table->string('gateway_session_id')->nullable()->index();
            $table->unsignedInteger('amount');          // بالسنت
            $table->string('currency', 3)->default('usd');
            $table->string('status')->default('pending'); // pending | paid | failed | refunded
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('pos_connections');
    }
};
