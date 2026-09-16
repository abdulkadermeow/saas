<?php

namespace App\Http\Controllers;

use App\Models\AssistantSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * إعدادات رفيق ورفيقة — يقرأها ويعدّلها صاحب المتجر من الداشبورد،
 * ويقرأها n8n عند كل محادثة ليبني شخصية المساعد.
 */
class AssistantController extends Controller
{
    private const ASSISTANTS = ['rafiq', 'rafiqa'];

    public function show(Request $request, string $assistant): JsonResponse
    {
        abort_unless(in_array($assistant, self::ASSISTANTS), 404);

        $setting = AssistantSetting::firstOrCreate(
            ['user_id' => $request->user()->id, 'assistant' => $assistant],
            ['prompt' => '', 'skills' => []]
        );

        return response()->json(['assistant' => $setting]);
    }

    public function update(Request $request, string $assistant): JsonResponse
    {
        abort_unless(in_array($assistant, self::ASSISTANTS), 404);

        $data = $request->validate([
            'active' => ['sometimes', 'boolean'],
            'tone' => ['sometimes', 'string', 'max:60'],
            'prompt' => ['sometimes', 'string', 'max:10000'],
            'skills' => ['sometimes', 'array'],
            'skills.*' => ['string', 'max:120'],
            'voice' => ['sometimes', 'nullable', 'string', 'max:120'],
            'working_hours' => ['sometimes', 'nullable', 'string', 'max:60'],
        ]);

        $setting = AssistantSetting::updateOrCreate(
            ['user_id' => $request->user()->id, 'assistant' => $assistant],
            $data
        );

        return response()->json(['assistant' => $setting]);
    }
}
