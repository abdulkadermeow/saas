import { useState } from 'react'
import { MessageSquare, PhoneCall, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useStore } from '@/hooks/useStore'
import { AVAILABLE_SKILLS, TONES, VOICES } from '@/data/demo'
import type { AssistantConfig } from '@/types'

function AssistantForm({
  kind,
  config,
  onChange,
}: {
  kind: 'rafiq' | 'rafiqa'
  config: AssistantConfig
  onChange: (patch: Partial<AssistantConfig>) => void
}) {
  const isRafiqa = kind === 'rafiqa'

  const toggleSkill = (skill: string) => {
    onChange({
      skills: config.skills.includes(skill)
        ? config.skills.filter((s) => s !== skill)
        : [...config.skills, skill],
    })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">الهوية والنبرة</h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${config.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                {config.active ? 'يعمل' : 'متوقف'}
              </span>
              <Switch dir="ltr" checked={config.active} onCheckedChange={(v) => onChange({ active: v })} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">اسم المساعد</label>
              <input
                value={config.name}
                onChange={(e) => onChange({ name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600">نبرة الرد</label>
              <Select dir="rtl" value={config.tone} onValueChange={(v) => onChange({ tone: v })}>
                <SelectTrigger className="bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isRafiqa && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">الصوت</label>
                  <Select dir="rtl" value={config.voice} onValueChange={(v) => onChange({ voice: v })}>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICES.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">ساعات الرد على المكالمات</label>
                  <input
                    value={config.workingHours}
                    onChange={(e) => onChange({ workingHours: e.target.value })}
                    placeholder="9:00 - 21:00"
                    dir="ltr"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-right text-sm focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-1 font-bold text-slate-900">المهارات</h3>
          <p className="mb-4 text-xs text-slate-500">حدد ما يستطيع المساعد القيام به مع الزبائن</p>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_SKILLS.map((skill) => {
              const on = config.skills.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    on
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {skill}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-1 font-bold text-slate-900">التوجيهات الأساسية (System Prompt)</h3>
        <p className="mb-4 text-xs text-slate-500">
          هذه التعليمات تُرسل لنموذج الذكاء الاصطناعي مع كل محادثة عبر n8n
        </p>
        <textarea
          value={config.prompt}
          onChange={(e) => onChange({ prompt: e.target.value })}
          rows={14}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed focus:border-emerald-400 focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">{config.prompt.length.toLocaleString('ar')} حرف</span>
          <button
            onClick={() => toast.success('تم حفظ التوجيهات — ستُطبق على المحادثات القادمة')}
            className="flex items-center gap-2 rounded-lg bg-[#12141f] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800"
          >
            <Save className="h-4 w-4" />
            حفظ التوجيهات
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Assistants() {
  const { rafiq, rafiqa, updateRafiq, updateRafiqa } = useStore()
  const [tab, setTab] = useState('rafiq')

  return (
    <Tabs dir="rtl" value={tab} onValueChange={setTab}>
      <TabsList className="mb-5 grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="rafiq" className="gap-2">
          <MessageSquare className="h-4 w-4" /> رفيق — شات واتساب
        </TabsTrigger>
        <TabsTrigger value="rafiqa" className="gap-2">
          <PhoneCall className="h-4 w-4" /> رفيقة — مكالمات
        </TabsTrigger>
      </TabsList>
      <TabsContent value="rafiq">
        <AssistantForm kind="rafiq" config={rafiq} onChange={updateRafiq} />
      </TabsContent>
      <TabsContent value="rafiqa">
        <AssistantForm kind="rafiqa" config={rafiqa} onChange={updateRafiqa} />
      </TabsContent>
    </Tabs>
  )
}
