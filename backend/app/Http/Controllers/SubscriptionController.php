<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use App\Services\Payments\PaymentManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    /** اشتراك المستخدم الحالي + رصيد الرسائل */
    public function show(Request $request): JsonResponse
    {
        $sub = $request->user()->activeSubscription;

        return response()->json([
            'subscription' => $sub ? [
                'plan_id' => $sub->plan_id,
                'plan' => $sub->plan(),
                'status' => $sub->status,
                'messages_total' => $sub->messages_total,
                'messages_used' => $sub->messages_used,
                'messages_remaining' => $sub->remainingMessages(),
                'renews_at' => $sub->renews_at?->toDateString(),
            ] : null,
        ]);
    }

    /**
     * الاشتراك بباقة: ينشئ سجل دفع pending ويعيد رابط الدفع (Stripe Checkout).
     * التفعيل الفعلي يتم عبر Webhook بعد الدفع.
     */
    public function checkout(Request $request): JsonResponse
    {
        $data = $request->validate([
            'plan_id' => ['required', 'string'],
        ]);

        $plan = collect(config('plans.plans'))->firstWhere('id', $data['plan_id']);

        if (! $plan) {
            return response()->json(['message' => 'باقة غير موجودة'], 404);
        }

        $user = $request->user();
        $gateway = PaymentManager::driver();

        [$subscription, $payment] = DB::transaction(function () use ($user, $plan, $gateway) {
            // إلغاء أي اشتراكات معلّقة سابقة حتى لا تتراكم سجلات عالقة
            $user->subscriptions()
                ->where('status', 'pending')
                ->update(['status' => 'canceled']);

            $subscription = Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $plan['id'],
                'status' => 'pending',
                'messages_total' => $plan['messages'],
                'gateway' => $gateway->name(),
            ]);

            $payment = Payment::create([
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'gateway' => $gateway->name(),
                'amount' => (int) ($plan['price'] * 100), // تخزين بالسنتات
                'currency' => config('services.payments.currency', 'usd'),
                'status' => 'pending',
            ]);

            return [$subscription, $payment];
        });

        try {
            $checkout = $gateway->createCheckout($user, $plan, $payment);
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['message' => 'تعذّر إنشاء جلسة الدفع، تحقق من إعدادات البوابة'], 502);
        }

        $payment->update(['gateway_session_id' => $checkout['session_id']]);

        return response()->json([
            'checkout_url' => $checkout['checkout_url'],
            'gateway' => $gateway->name(),
        ], 201);
    }
}
