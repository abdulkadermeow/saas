<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * تفعيل اشتراك يدوياً (للدفع اليدوي):
 * php artisan subscription:activate {user_email} {plan_id}
 */
Artisan::command('subscription:activate {email} {plan}', function () {
    $user = \App\Models\User::where('email', $this->argument('email'))->firstOrFail();
    $plan = collect(config('plans.plans'))->firstWhere('id', $this->argument('plan'));

    if (! $plan) {
        $this->error('باقة غير موجودة');
        return 1;
    }

    $user->subscriptions()->where('status', 'active')->update(['status' => 'canceled']);

    $user->subscriptions()->create([
        'plan_id' => $plan['id'],
        'status' => 'active',
        'messages_total' => $plan['messages'],
        'gateway' => 'manual',
        'renews_at' => now()->addMonth(),
    ]);

    $this->info("تم تفعيل باقة {$plan['name']} للمستخدم {$user->email}");
})->purpose('تفعيل اشتراك يدوياً بعد تأكيد الدفع اليدوي');
