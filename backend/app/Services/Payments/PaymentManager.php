<?php

namespace App\Services\Payments;

class PaymentManager
{
    /**
     * البوابة الافتراضية (من config/services.php → payments.default).
     * PAYMENT_GATEWAY=manual → يدوي عبر واتساب | =stripe → Stripe Checkout
     */
    public static function driver(?string $name = null): PaymentGateway
    {
        $name = $name ?? config('services.payments.default', 'manual');

        return match ($name) {
            'manual' => new ManualDriver(),
            'stripe' => new StripeDriver(),
            default => throw new \InvalidArgumentException("Unknown payment gateway: {$name}"),
        };
    }

    /**
     * بوابة باسم محدد — تُستدعى من webhook العام /api/webhooks/payments/{gateway}.
     *
     * @throws \InvalidArgumentException
     */
    public static function forName(string $name): PaymentGateway
    {
        return self::driver($name);
    }
}
