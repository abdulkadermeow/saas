<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = User::create($data);

        // التعديل 1: منع إرجاع التوكن والدخول المباشر بعد التسجيلس
        // نرجّع رسالة تطلب الانتظار حتى التفعيل
        return response()->json([
            'message' => 'تم إنشاء الحساب بنجاح. حسابك قيد المراجعة، يرجى الانتظار حتى يتم تفعيله من قبل الإدارة.'
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        // 1. التحقق من صحة بيانات الدخول
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['بيانات الدخول غير صحيحة'],
            ]);
        }

        // 2. التعديل 2: التحقق من التفعيل (is_approved) قبل إرجاع التوكن
        if (! $user->is_approved) {
            // استخدام ValidationException لتتوافق مع تصميم أخطاء الرياكت عندك
            throw ValidationException::withMessages([
                'email' => ['حسابك قيد المراجعة. يرجى الانتظار حتى يتم تفعيله من قبل الإدارة.'],
            ]);
        }

        // أبطال صلاحية التوكنات القديمة — جلسة واحدة نشطة لكل حساب
        $user->tokens()->delete();

        return $this->tokenResponse($user);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'تم تسجيل الخروج']);
    }

    /** المستخدم الحالي + اشتراكه النشط ورصيده — بيانات جاهزة للداشبورد */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('activeSubscription');

        $sub = $user->activeSubscription;

        return response()->json([
            'user' => $user->only('id', 'name', 'email'),
            'subscription' => $sub ? [
                'plan_id' => $sub->plan_id,
                'plan' => $sub->plan(),
                'status' => $sub->status,
                'messages_total' => $sub->messages_total,
                'messages_used' => $sub->messages_used,
                'messages_remaining' => $sub->remainingMessages(),
                'renews_at' => $sub->renews_at?->toDateString(),
            ] : null,
            'has_business_plan' => $user->hasBusinessPlan(),
        ]);
    }

    private function tokenResponse(User $user, int $status = 200): JsonResponse
    {
        $token = $user->createToken('dashboard', ['*'], now()->addDays(30))->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->only('id', 'name', 'email'),
        ], $status);
    }
}