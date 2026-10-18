<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyN8nSecret
{
    public function handle(Request $request, Closure $next): Response
    {
        $secret = env('N8N_SHARED_SECRET') ?: env('N8N_SECRET');

        if (empty($secret)) {
            return response()->json([
                'message' => 'N8N_SHARED_SECRET غير مضبوط على السيرفر',
            ], 500);
        }

        $provided = (string) $request->header('X-N8N-SECRET', '');

        if ($provided === '' || ! hash_equals($secret, $provided)) {
            return response()->json([
                'message' => 'غير مصرّح',
            ], 401);
        }

        return $next($request);
    }
}