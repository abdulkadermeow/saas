<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // إعدادات رفيق ورفيقة لكل مستخدم — يقرأها n8n عند كل محادثة
        Schema::create('assistant_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('assistant'); // rafiq | rafiqa
            $table->boolean('active')->default(true);
            $table->string('tone')->default('ودودة');
            $table->text('prompt')->nullable();
            $table->json('skills')->nullable();
            $table->string('voice')->nullable();
            $table->string('working_hours')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'assistant']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assistant_settings');
    }
};
