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
            'customer_phone' => ['sometimes', 'string'], // استقبال رقم العميل من n8n
        ]);

        $user = User::with([
            'activeSubscription',
            // التعديل الأول: جلب الإعدادات الفعالة فقط والأحدث لمنع استخدام المسودات أو الإعدادات القديمة
            'assistantSettings' => fn ($q) => $q->where('assistant', $data['assistant'])
                                                ->where('status', 'active')
                                                ->latest(),
        ])->findOrFail($data['user_id']);

        $setting = $user->assistantSettings->first();
        $subscription = $user->activeSubscription;
        
        // التعديل الثاني: بناء التوجيه الأساسي بشكل صارم ليفهمه الـ LLM
        $basePrompt = $setting?->prompt ?? 'أنت مساعد ذكي عام.';
        $finalPrompt = "### تعليمات الشخصية الأساسية (يجب الالتزام بها حرفياً): ###\n" . $basePrompt . "\n";

        // --- بناء ذاكرة السياق (Context Memory) ---
        $contextMemory = "";
        if (!empty($data['customer_phone'])) {
            $conversation = Conversation::where('user_id', $user->id)
                ->where('phone', $data['customer_phone'])
                ->with(['messages' => fn($q) => $q->orderBy('created_at', 'desc')->limit(5)]) // آخر 5 رسائل فقط
                ->first();

            if ($conversation && $conversation->messages->isNotEmpty()) {
                $contextMemory = "\n\n### معلومات العميل الحالي: ###";
                $contextMemory .= "\nالاسم: " . ($conversation->customer_name ?? 'غير محدد');
                $contextMemory .= "\nرقم الهاتف: " . $conversation->phone;
                
                $contextMemory .= "\n\n### آخر 5 رسائل في المحادثة (للسياق فقط): ###";
                $recentMessages = $conversation->messages->reverse(); // ترتيب طبيعي للـ LLM
                foreach ($recentMessages as $msg) {
                    $sender = $msg->direction === 'in' ? 'العميل' : 'أنت (المساعد)';
                    $contextMemory .= "\n{$sender}: {$msg->text}";
                }
            }
        }
        
        // دمج الـ Prompt الأساسي من الداشبورد مع ذاكرة السياق
        $finalPrompt .= $contextMemory;

        return response()->json([
            'assistant' => $data['assistant'],
            'active' => (bool) ($setting?->active ?? true),
            'tone' => $setting?->tone ?? 'رسمية',
            'prompt' => $finalPrompt, // هنا نرسل الـ Prompt المدمج لـ n8n
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
            'via' => ['sometimes', 'in:rafiq,rafiqa,whatsapp,telegram'],
        ]);

        $result = DB::transaction(function () use ($data) {
            $conversation = Conversation::firstOrNew([
                'user_id' => $data['user_id'],
                'phone' => $data['phone'],
            ]);

            // البرمجة الدفاعية: التدرج في جلب القيمة لمنع بقاء الحقل null في السجلات الجديدة
          $customerName = !empty($data['customer_name']) 
                ? $data['customer_name'] 
                : ($conversation->customer_name ?? 'عميل غير محدد');

            $category = $data['category'] 
                ?? $conversation->category 
                ?? 'استفسار عام';

            $conversation->fill([
                'customer_name' => $customerName, // سيتم تحديث الاسم هنا
                'category' => $category,
                'last_message' => mb_substr($data['text'], 0, 250),
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
                $subscription = $conversation->user?->activeSubscription;

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