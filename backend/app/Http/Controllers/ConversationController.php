<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    /** قائمة المحادثات للداشبورد */
    public function index(Request $request): JsonResponse
    {
        $conversations = $request->user()
            ->conversations()
            ->withCount('messages')
            ->orderByDesc('last_message_at')
            ->paginate(30);

        return response()->json($conversations);
    }

    /** محادثة واحدة مع رسائلها */
    public function show(Request $request, Conversation $conversation): JsonResponse
    {
        abort_unless($conversation->user_id === $request->user()->id, 403);

        $conversation->load('messages');
        $conversation->update(['unread' => false]);

        return response()->json(['conversation' => $conversation]);
    }
}
