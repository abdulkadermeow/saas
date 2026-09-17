<?php

namespace App\Services\Payments;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * بوابة يدوية — للأسواق التي لا تدعمها البوابات العالمية.
 * الاشتراك يبقى "pending" ويتواصل العميل معك (واتساب/حوالة)،
 * ثم تفعّل الاشتراك يدوياً من لوحة الإدارة أو عبر artisan.
 */
class ManualGateway implements PaymentGateway
{
    public function name(): string
    {
        return 'manual';
    }

    public function createCheckout(User $user, array $plan, Payment $payment): array
    {
        $contact = config('services.payments.manual_contact');

        $url = $contact && str_starts_with($contact, 'http')
            ? $contact
            : 'https://wa.me/'.preg_replace('/\D/', '', (string) $contact).'?text='.rawurlencode(
                "مرحباً، أريد تفعيل باقة {$plan['name']} (\${$plan['price']}/شهرياً) لحساب: {$user->email}"
            );

        return ['checkout_url' => $url, 'session_id' => 'manual-'.$payment->id];
    }

    public function handleWebhook(Request $request): array
    {
        // لا يوجد Webhook في الدفع اليدوي
        return ['payment' => null, 'paid' => false];
    }
}
