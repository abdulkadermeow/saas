<?php

namespace App\Http\Controllers;

use App\Services\Payments\PaymentManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Webhook عام تستدعيه بوابة الدفع (بدون auth — الحماية عبر توقيع البوابة).
     * عند نجاح الدفع: يفعّل الاشتراك ويلغي أي اشتراك نشط سابق.
     */
    public function webhook(Request $request, string $gateway): JsonResponse
    {
        try {
            $gatewayImpl = PaymentManager::forName($gateway);
        } catch (\InvalidArgumentException) {
            return response()->json(['message' => 'بوابة غير معروفة'], 404);
        }

        $result = $gatewayImpl->handleWebhook($request);

        if (! $result['paid'] || ! $result['payment']) {
            return response()->json(['received' => true]);
        }

        $payment = $result['payment'];

        DB::transaction(function () use ($payment) {
            $subscription = $payment->subscription;

            if (! $subscription || $subscription->status === 'active') {
                return;
            }

            // إلغاء الاشتراكات النشطة السابقة ثم تفعيل الجديد
            $subscription->user->subscriptions()
                ->where('status', 'active')
                ->update(['status' => 'canceled']);

            $subscription->update([
                'status' => 'active',
                'messages_used' => 0,
                'renews_at' => now()->addMonth(),
            ]);
        });

        return response()->json(['received' => true]);
    }
}
