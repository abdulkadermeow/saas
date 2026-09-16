<?php

namespace App\Services\Payments;

use InvalidArgumentException;

/**
 * يختار البوابة الفعّالة من PAYMENT_GATEWAY في .env
 */
class PaymentManager
{
    public static function driver(): PaymentGateway
    {
        return match (config('services.payments.gateway', 'manual')) {
            'stripe' => new StripeGateway,
            'manual' => new ManualGateway,
            default => throw new InvalidArgumentException('بوابة دفع غير معروفة'),
        };
    }

    public static function forName(string $name): PaymentGateway
    {
        return match ($name) {
            'stripe' => new StripeGateway,
            'manual' => new ManualGateway,
            default => throw new InvalidArgumentException('بوابة دفع غير معروفة'),
        };
    }
}
