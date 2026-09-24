<?php

namespace App\Services\Payments;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * بوابة الدفع اليدوي — بدون Stripe:
 * زر "اشترك الآن" بالفرونت بيفتح محادثة واتساب مع المسؤول،
 * وبعد تأكيد التحويل يفعّل المسؤول الاشتراك يدوياً
 * (من لوحة الإدارة أو مباشرة بقاعدة البيانات).
 */
class ManualDriver implements PaymentGateway
{
    public function name(): string
    {
        return 'manual';
    }

    public function createCheckout(User $user, array $plan, Payment $payment): array
    {
        $contact = preg_replace('/\D/', '', (string) config('services.payments.manual_contact'));
        $text = sprintf(
            "مرحباً، أريد الاشتراك بباقة %s (%s$/%s)\nالبريد: %s\nرقم العملية: #%s",
            $plan['name'],
            $plan['price'],
            config('services.payments.currency', 'usd'),
            $user->email,
            $payment->id,
        );

        return [
            'session_id' => 'manual-'.$payment->id,
            'checkout_url' => "https://wa.me/{$contact}?text=".rawurlencode($text),
        ];
    }

    /**
     * الدفع اليدوي ما إله webhook — التفعيل يدوي من المسؤول.
     */
    public function handleWebhook(Request $request): array
    {
        return ['paid' => false, 'payment' => null];
    }
}
