<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('plan_id'); // basic | pro | business (من config/plans.php)
            $table->string('status')->default('pending'); // pending | active | canceled | expired
            $table->unsignedInteger('messages_total')->default(0);
            $table->unsignedInteger('messages_used')->default(0);
            $table->string('gateway')->nullable();        // stripe | manual
            $table->string('gateway_reference')->nullable(); // checkout session / subscription id
            $table->timestamp('renews_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
