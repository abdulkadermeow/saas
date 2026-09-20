<?php

namespace App\Services\Payments;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\Webhook;

/**
 * بوابة Stripe — الدفع يتم على صفحة Stripe المستضافة (Checkout)
 * فلا تمرّ بيانات البطاقة على سيرفرك إطلاقاً (امتثال PCI مبسّط).
 */
class StripeGateway implements PaymentGateway
{
    public function name(): string
    {
        return 'stripe';
    }

    public function createCheckout(User $user, array $plan, Payment $payment): array
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $frontend = rtrim(config('services.frontend_url'), '/');

        $session = Session::create([
            'mode' => 'payment',
            'customer_email' => $user->email,
            'line_items' => [[
                'quantity' => 1,
                'price_data' => [
                    'currency' => config('services.payments.currency', 'usd'),
                    'unit_amount' => (int) ($plan['price'] * 100),
                    'product_data' => [
                        'name' => 'باقة '.$plan['name'].' — اشتراك شهري',
                    ],
                ],
            ]],
            'metadata' => [
                'user_id' => $user->id,
                'plan_id' => $plan['id'],
                'payment_id' => $payment->id,
            ],
            'success_url' => $frontend.'/subscription?payment=success',
            'cancel_url' => $frontend.'/subscription?payment=cancelled',
        ]);

        $payment->update(['gateway_session_id' => $session->id]);

        return ['checkout_url' => $session->url, 'session_id' => $session->id];
    }

    public function handleWebhook(Request $request): array
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $signature,
                config('services.stripe.webhook_secret')
            );
        } catch (SignatureVerificationException $e) {
            abort(400, 'توقيع غير صالح');
        }

        if ($event->type !== 'checkout.session.completed') {
            return ['payment' => null, 'paid' => false];
        }

        $session = $event->data->object;
        $paymentId = $session->metadata->payment_id ?? null;

        $payment = $paymentId
            ? Payment::find($paymentId)
            : Payment::where('gateway_session_id', $session->id)->first();

        if (! $payment) {
            return ['payment' => null, 'paid' => false];
        }

        // idempotency: لا تعالج دفعة مدفوعة مرتين
        if ($payment->status === 'paid') {
            return ['payment' => $payment, 'paid' => false];
        }

        $payment->update(['status' => 'paid', 'paid_at' => now()]);

        return ['payment' => $payment, 'paid' => true];
    }
}
