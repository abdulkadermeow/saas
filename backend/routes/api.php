<?php

use App\Http\Controllers\AssistantController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\N8nController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — منصة رفيق ورفيقة
|--------------------------------------------------------------------------
*/

// ─── عام (بدون تسجيل دخول) ────────────────────────────────────────────────
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

Route::get('/plans', [PlanController::class, 'index']);

// Webhook بوابة الدفع — الحماية عبر توقيع البوابة وليس عبر auth
Route::post('/webhooks/payments/{gateway}', [PaymentController::class, 'webhook'])
    ->middleware('throttle:60,1');

// التحقق من ترخيص POS — يستدعيه نظام الـ POS الخارجي
Route::post('/pos/verify-license', [PosController::class, 'verifyLicense'])
    ->middleware('throttle:60,1');

// ─── n8n (machine-to-machine، محمي بسر مشترك) ─────────────────────────────
Route::prefix('n8n')->middleware(['n8n.secret', 'throttle:240,1'])->group(function () {
    Route::get('/assistant-config', [N8nController::class, 'assistantConfig']);
    Route::post('/events', [N8nController::class, 'event']);
});

// ─── لوحة التحكم (تحتاج توكن Sanctum) ─────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/subscription', [SubscriptionController::class, 'show']);
    Route::post('/subscription/checkout', [SubscriptionController::class, 'checkout']);

    Route::get('/assistants/{assistant}', [AssistantController::class, 'show']);
    Route::put('/assistants/{assistant}', [AssistantController::class, 'update']);

    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);

    // نظام POS — حصري لباقة الأعمال
    Route::middleware('plan.business')->prefix('pos')->group(function () {
        Route::get('/connection', [PosController::class, 'show']);
        Route::post('/connection', [PosController::class, 'store']);
        Route::get('/summary', [PosController::class, 'summary']);
    });
});
