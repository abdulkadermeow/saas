<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assistant_settings', function (Blueprint $table) {
            $table->text('draft_prompt')->nullable()->after('prompt');
            $table->json('draft_skills')->nullable()->after('skills');
            $table->enum('status', ['active', 'pending'])->default('active')->after('active');
        });
    }

    public function down(): void
    {
        Schema::table('assistant_settings', function (Blueprint $table) {
            $table->dropColumn(['draft_prompt', 'draft_skills', 'status']);
        });
    }
};