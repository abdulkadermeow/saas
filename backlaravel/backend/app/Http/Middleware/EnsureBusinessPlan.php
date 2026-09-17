<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * يسمح فقط لمشتركي باقة الأعمال بالوصول (ميزة نظام POS).
 */
class EnsureBusinessPlan
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->hasBusinessPlan()) {
            return response()->json([
                'message' => 'هذه الميزة متاحة فقط ضمن باقة الأعمال',
                'required_plan' => 'business',
            ], 403);
        }

        return $next($request);
    }
}
