<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('customer_name')->nullable();
            $table->string('phone')->index();
            $table->string('category')->nullable(); // مهتم للشراء | شكوى | اعتراض على السعر | استفسار عام
            $table->string('last_message')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->boolean('unread')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'phone']);
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->string('direction'); // in (من العميل) | out (من المساعد)
            $table->text('text');
            $table->string('via')->default('rafiq'); // rafiq | rafiqa
            $table->timestamps();

            $table->index(['conversation_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
    }
};
