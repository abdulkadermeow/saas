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
public function update(Request $request, $assistant): JsonResponse
    {
        $data = $request->validate([
            'active' => 'sometimes|boolean',
            'tone' => 'sometimes|string',
            'prompt' => 'sometimes|string|nullable',
            'skills' => 'sometimes|array',
            'voice' => 'sometimes|string|nullable',
            'working_hours' => 'sometimes|string|nullable',
        ]);

        $setting = $request->user()->assistantSettings()->firstOrCreate(
            ['assistant' => $assistant],
            ['active' => true]
        );

        $updateData = [];

        // الإعدادات العادية تتحدث مباشرة
        if (array_key_exists('active', $data)) $updateData['active'] = $data['active'];
        if (array_key_exists('tone', $data)) $updateData['tone'] = $data['tone'];
        if (array_key_exists('voice', $data)) $updateData['voice'] = $data['voice'];
        if (array_key_exists('working_hours', $data)) $updateData['working_hours'] = $data['working_hours'];

        // الإعدادات الحساسة (البرومبت والمهارات) تذهب للمسودة وتغير الحالة
        if (array_key_exists('prompt', $data) || array_key_exists('skills', $data)) {
            if (array_key_exists('prompt', $data)) $updateData['draft_prompt'] = $data['prompt'];
            if (array_key_exists('skills', $data)) $updateData['draft_skills'] = $data['skills'];
            $updateData['status'] = 'pending'; // تحويل للانتظار
        }

        $setting->update($updateData);

        return response()->json(['message' => 'تم الحفظ بنجاح', 'setting' => $setting]);
    }
}
