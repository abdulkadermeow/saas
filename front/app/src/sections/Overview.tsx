import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MessageSquare, Users, Wallet, TrendingUp, PhoneCall } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useStore } from '@/hooks/useStore'
import { WEEK_STATS } from '@/data/demo'
import type { PageKey } from '@/components/Layout'

const CATEGORY_COLORS: Record<string, string> = {
  'مهتم للشراء': 'bg-emerald-100 text-emerald-700',
  شكوى: 'bg-red-100 text-red-700',
  'اعتراض على السعر': 'bg-amber-100 text-amber-700',
  'استفسار عام': 'bg-sky-100 text-sky-700',
}

export default function Overview({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  const { rafiq, rafiqa, updateRafiq, updateRafiqa, messageBalance, messageTotal, conversations = [], whatsapp } =
    useStore()

  const monthMessages = WEEK_STATS.reduce((a, b) => a + (b.messages || 0), 0)
  const activeCustomers = conversations.length

  const stats = [
    { label: 'رسائل اليوم', value: '٩٦', icon: MessageSquare, hint: '+١٢٪ عن أمس' },
    { label: 'رسائل هذا الأسبوع', value: monthMessages.toLocaleString('ar'), icon: TrendingUp, hint: 'آخر ٧ أيام' },
    { label: 'العملاء المتفاعلون', value: activeCustomers.toLocaleString('ar'), icon: Users, hint: 'محادثة نشطة' },
    { label: 'رصيد الرسائل المتبقي', value: (messageBalance || 0).toLocaleString('ar'), icon: Wallet, hint: `من ${(messageTotal || 0).toLocaleString('ar')}` },
  ]

  return (
    <div className="space-y-6">
      {/* Bot toggles */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900">رفيق — شات بوت واتساب</div>
              <div className="text-xs text-slate-500">
                {rafiq?.active ? 'يرد على الرسائل الآن' : 'متوقف — لن يرد على الرسائل'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${rafiq?.active ? 'text-emerald-600' : 'text-slate-400'}`}>
              {rafiq?.active ? 'يعمل' : 'متوقف'}
            </span>
            <Switch dir="ltr" checked={rafiq?.active || false} onCheckedChange={(v) => updateRafiq({ active: v })} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900">رفيقة — الرد على المكالمات</div>
              <div className="text-xs text-slate-500">
                {rafiqa?.active ? 'ترد على المكالمات الآن' : 'متوقفة — المكالمات تذهب للبريد الصوتي'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${rafiqa?.active ? 'text-sky-600' : 'text-slate-400'}`}>
              {rafiqa?.active ? 'تعمل' : 'متوقفة'}
            </span>
            <Switch dir="ltr" checked={rafiqa?.active || false} onCheckedChange={(v) => updateRafiqa({ active: v })} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{s.label}</span>
              <s.icon className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{s.value}</div>
            <div className="mt-1 text-xs text-slate-400">{s.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        {/* Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">الرسائل خلال الأسبوع</h3>
            <span className="text-xs text-slate-400">آخر ٧ أيام</span>
          </div>
          <div dir="ltr" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEK_STATS} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="msg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13, direction: 'rtl' }}
                  formatter={(v) => [v, 'رسالة']}
                />
                <Area type="monotone" dataKey="messages" stroke="#10b981" strokeWidth={2.5} fill="url(#msg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest conversations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">أحدث المحادثات</h3>
            <button
              onClick={() => onNavigate('conversations')}
              className="text-xs font-medium text-emerald-600 hover:underline"
            >
              عرض الكل
            </button>
          </div>
          <div className="space-y-1">
            {conversations.slice(0, 5).map((c, index) => {
              const displayName = (c as any).name || (c as any).customerName || 'عميل غير محدد'
              const avatarChar = displayName.charAt(0) || '?'
              const category = (c as any).category || 'استفسار عام'
              const categoryColor = CATEGORY_COLORS[category] || 'bg-slate-100 text-slate-700'

              return (
                <button
                  key={c.id || index}
                  onClick={() => onNavigate('conversations')}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-right transition-colors hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                    {avatarChar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold text-slate-800">{displayName}</span>
                      {c.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
                    </div>
                    <div className="truncate text-xs text-slate-500">{c.lastMessage || 'لا توجد رسائل'}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${categoryColor}`}>
                    {category}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {!whatsapp?.connected && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="text-sm text-amber-800">
            <span className="font-bold">رقم الواتساب غير مربوط بعد.</span> اربط حساب Meta الخاص بك ليبدأ رفيق بالرد على
            رسائل زبائنك.
          </div>
          <button
            onClick={() => onNavigate('whatsapp')}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-500"
          >
            الربط الآن
          </button>
        </div>
      )}
    </div>
  )
}