<?php

namespace App\Http\Controllers;

use App\Models\PosConnection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * ربط نظام نقاط البيع الخارجي — كل المسارات هنا محمية بـ plan.business
 * أي أنها متاحة حصرياً لمشتركي باقة الأعمال.
 *
 * اتجاهان للربط:
 * 1) الداشبورد ← POS: يحفظ المستخدم رابط ومفتاح نظامه، والباك يعمل Proxy آمن
 *    لسحب ملخص المبيعات دون كشف مفتاح الـ POS للمتصفح.
 * 2) POS → المنصة: نظام الـ POS يتحقق دورياً من صلاحية الترخيص عبر
 *    /api/pos/verify-license فيتوقف تلقائياً إذا انتهى الاشتراك.
 */
class PosController extends Controller
{
    /** بيانات الاتصال الحالية (بدون كشف api_key) */
    public function show(Request $request): JsonResponse
    {
        $connection = $request->user()->posConnection;

        return response()->json(['connection' => $connection]);
    }

    /** حفظ/تحديث بيانات الربط وتوليد مفتاح ترخيص جديد */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'base_url' => ['required', 'url', 'max:255'],
            'api_key' => ['required', 'string', 'max:500'],
        ]);

        $connection = PosConnection::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'name' => $data['name'] ?? 'نظام POS',
                'base_url' => rtrim($data['base_url'], '/'),
                'api_key' => $data['api_key'],
                'license_key' => Str::random(48),
                'active' => true,
            ]
        );

        return response()->json([
            'connection' => $connection->fresh(),
            // يُعرض مرة واحدة فقط ليسلّمه المستخدم لفريق نظام الـ POS
            'license_key' => $connection->license_key,
        ], 201);
    }

    /** Proxy آمن: سحب ملخص المبيعات من نظام الـ POS */
    public function summary(Request $request): JsonResponse
    {
        $connection = $request->user()->posConnection;

        if (! $connection || ! $connection->active) {
            return response()->json(['message' => 'لا يوجد اتصال POS مفعّل'], 404);
        }

        try {
            $response = Http::timeout(8)
                ->withToken($connection->api_key)
                ->acceptJson()
                ->get($connection->base_url.'/api/summary');
        } catch (\Throwable) {
            return response()->json(['message' => 'تعذّر الوصول لنظام POS'], 502);
        }

        if ($response->failed()) {
            return response()->json(['message' => 'رفض نظام POS الطلب', 'status' => $response->status()], 502);
        }

        $connection->update(['last_synced_at' => now()]);

        return response()->json(['summary' => $response->json()]);
    }

    /**
     * يستدعيه نظام الـ POS نفسه للتحقق من الترخيص (بدون تسجيل دخول).
     * POST /api/pos/verify-license  { "license_key": "..." }
     */
    public function verifyLicense(Request $request): JsonResponse
    {
        $data = $request->validate(['license_key' => ['required', 'string', 'size:48']]);

        $connection = PosConnection::where('license_key', $data['license_key'])->first();

        $valid = $connection !== null
            && $connection->active
            && $connection->user->hasBusinessPlan();

        return response()->json([
            'valid' => $valid,
            'plan' => $valid ? 'business' : null,
        ]);
    }
}
