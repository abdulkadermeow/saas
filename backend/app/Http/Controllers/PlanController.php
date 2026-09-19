<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class PlanController extends Controller
{
    /** قائمة الباقات (من config/plans.php) */
    public function index(): JsonResponse
    {
        return response()->json(['plans' => config('plans.plans')]);
    }
}
