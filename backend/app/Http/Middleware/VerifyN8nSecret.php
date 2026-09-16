<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * مصادقة طلبات n8n الآلية عبر سر مشترك يُرسل بهيدر X-N8N-SECRET.
 * المقارنة بـ hash_equals لمنع هجمات التوقيت (timing attacks).
 */
class VerifyN8nSecret
{
    public function handle(Request $request, Closure $next): Response
    {
        $secret = config('services.n8n_secret');

        if (empty($secret)) {
            return response()->json(['message' => 'N8N_SHARED_SECRET غير مضبوط على السيرفر'], 500);
        }

        $provided = (string) $request->header('X-N8N-SECRET', '');

        if ($provided === '' || ! hash_equals($secret, $provided)) {
            return response()->json(['message' => 'غير مصرّح'], 401);
        }

        return $next($request);
    }
}
