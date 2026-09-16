<?php

namespace App\Services\Payments;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * واجهة موحّدة لأي بوابة دفع.
 * لإضافة بوابة جديدة (HyperPay / Tap / Paymob): أنشئ كلاساً يطبق هذه الواجهة
 * وسجّله في PaymentManager — ولا تلمس باقي الكود.
 */
interface PaymentGateway
{
    /** اسم البوابة (يُخزّن في قاعدة البيانات) */
    public function name(): string;

    /**
     * إنشاء جلسة دفع لاشتراك جديد.
     * تعيد: checkout_url لتحويل المستخدم إليه + session_id للتتبع.
     *
     * @param  array  $plan  الباقة من config/plans.php
     */
    public function createCheckout(User $user, array $plan, Payment $payment): array;

    /**
     * معالجة الـ Webhook القادم من البوابة بعد التحقق من توقيعه.
     * تعيد: ['payment' => Payment|null, 'paid' => bool]
     */
    public function handleWebhook(Request $request): array;
}
