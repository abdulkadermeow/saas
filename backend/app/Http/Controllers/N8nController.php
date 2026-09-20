<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * جسر n8n — endpoints آلية (machine-to-machine) محمية بسر مشترك:
 *
 * 1) GET  /api/n8n/assistant-config  : n8n يسحب إعدادات المساعد + الباقة + الرصيد
 *    قبل توليد الرد، فيبني الـ system prompt على أساسها.
 *
 * 2) POST /api/n8n/events            : n8n يرسل كل رسالة بعد معالجتها لتُحفظ
 *    بالداشبورد ويُخصم رصيد رسالة من اشتراك العميل.
 */
class N8nController extends Controller
{
    public function assistantConfig(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'assistant' => ['required', 'in:rafiq,rafiqa'],
        ]);

        $user = User::with(['activeSubscription', 'assistantSettings' => fn ($q) => $q->where('assistant', $data['assistant'])])
            ->findOrFail($data['user_id']);

        $setting = $user->assistantSettings->first();
        $subscription = $user->activeSubscription;

        return response()->json([
            'assistant' => $data['assistant'],
            'active' => (bool) ($setting?->active ?? true),
            'tone' => $setting?->tone ?? 'ودودة',
            'prompt' => $setting?->prompt ?? '',
            'skills' => $setting?->skills ?? [],
            'voice' => $setting?->voice,
            'working_hours' => $setting?->working_hours,
            'subscription' => $subscription ? [
                'plan_id' => $subscription->plan_id,
                'messages_remaining' => $subscription->remainingMessages(),
            ] : null,
            'can_reply' => $subscription !== null
                && $subscription->remainingMessages() > 0
                && (bool) ($setting?->active ?? true),
        ]);
    }

    public function event(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'phone' => ['required', 'string', 'max:30'],
            'customer_name' => ['sometimes', 'nullable', 'string', 'max:120'],
            'category' => ['sometimes', 'nullable', 'string', 'max:60'],
            'direction' => ['required', 'in:in,out'],
            'text' => ['required', 'string', 'max:8000'],
            'via' => ['sometimes', 'in:rafiq,rafiqa'],
        ]);

        $result = DB::transaction(function () use ($data) {
            $conversation = Conversation::firstOrNew([
                'user_id' => $data['user_id'],
                'phone' => $data['phone'],
            ]);

            $conversation->fill([
                'customer_name' => $data['customer_name'] ?? $conversation->customer_name,
                'category' => $data['category'] ?? $conversation->category,
                'last_message' => mb_substr($data['text'], 0, 500),
                'last_message_at' => now(),
                'unread' => $data['direction'] === 'in',
            ])->save();

            $message = $conversation->messages()->create([
                'direction' => $data['direction'],
                'text' => $data['text'],
                'via' => $data['via'] ?? 'rafiq',
            ]);

            // خصم رصيد رسالة على الردود الصادرة فقط — بشكل ذري (آمن ضد الطلبات المتزامنة)
            if ($data['direction'] === 'out') {
                $subscription = $conversation->user->activeSubscription;

                if ($subscription) {
                    Subscription::whereKey($subscription->id)
                        ->whereColumn('messages_used', '<', 'messages_total')
                        ->increment('messages_used');
                }
            }

            return $message;
        });

        return response()->json(['stored' => true, 'message_id' => $result->id], 201);
    }
}
