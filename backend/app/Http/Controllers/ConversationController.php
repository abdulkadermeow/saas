<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    /** 
     * قائمة المحادثات للداشبورد مع تحصين حقول البيانات المرجعة
     */
    public function index(Request $request): JsonResponse
    {
        $conversations = $request->user()
            ->conversations()
            ->withCount('messages')
            ->orderByDesc('last_message_at')
            ->paginate(30);

        // تحويل عناصر الترقيم (Paginator) لمنع إرجاع قيم null لفرونت إند React
        $conversations->through(fn (Conversation $conversation) => $this->transformConversation($conversation));

        return response()->json($conversations);
    }

    /** 
     * محادثة واحدة مع رسائلها وتحديث حالة القراءة بأمان
     */
    public function show(Request $request, Conversation $conversation): JsonResponse
    {
        abort_unless($conversation->user_id === $request->user()->id, 403);

        $conversation->load('messages');
        
        // تحديث حالة القراءة دون إعادة استعلام كامل
        if ($conversation->unread) {
            $conversation->update(['unread' => false]);
        }

        return response()->json([
            'conversation' => array_merge(
                $this->transformConversation($conversation),
                [
                    'messages' => $conversation->messages ?? [],
                ]
            )
        ]);
    }

    /**
     * Data Mapper Helper: توحيد هيكل المحادثة لمنع استثناءات JavaScript TypeError
     */
    private function transformConversation(Conversation $conversation): array
    {
        return [
            'id' => $conversation->id,
            'user_id' => $conversation->user_id,
            'customer_name' => $conversation->customer_name ?? 'عميل جديد',
            'phone' => $conversation->phone ?? '-',
            'category' => $conversation->category ?? 'عام',
            'last_message' => $conversation->last_message ?? 'لا توجد رسائل',
            'last_message_at' => $conversation->last_message_at 
                ? $conversation->last_message_at->toIso8601String() 
                : now()->toIso8601String(),
            'unread' => (bool) $conversation->unread,
            'messages_count' => (int) ($conversation->messages_count ?? 0),
            'created_at' => $conversation->created_at?->toIso8601String(),
            'updated_at' => $conversation->updated_at?->toIso8601String(),
        ];
    }
}