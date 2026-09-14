import { Check, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useStore } from '@/hooks/useStore'
import { PLANS } from '@/data/demo'

export default function Subscription() {
  const { planId, setPlan, messageBalance, messageTotal, renewsAt } = useStore()
  const current = PLANS.find((p) => p.id === planId) ?? PLANS[1]
  const usedPct = Math.round(((messageTotal - messageBalance) / messageTotal) * 100)

  return (
    <div className="max-w-5xl space-y-6">
      {/* Current plan */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">باقتك الحالية</div>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-2xl font-extrabold text-slate-900">{current.name}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">نشطة</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              تتجدد تلقائياً في {new Date(renewsAt).toLocaleDateString('ar', { day: 'numeric', month: 'long', year: 'numeric' })} عبر Stripe
            </div>
          </div>
          <div className="w-full max-w-sm">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-slate-500">رصيد الرسائل</span>
              <span className="font-bold text-slate-800">
                {messageBalance.toLocaleString('ar')} / {messageTotal.toLocaleString('ar')}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  usedPct > 85 ? 'bg-red-500' : usedPct > 60 ? 'bg-amber-500' : 'bg-emerald-500',
                )}
                style={{ width: `${100 - usedPct}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-400">استهلكت {usedPct.toLocaleString('ar')}٪ من باقتك</div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === planId
          return (
            <div
              key={plan.id}
              className={cn(
                'flex flex-col rounded-2xl border bg-white p-6',
                isCurrent ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200',
              )}
            >
              {plan.id === 'pro' && (
                <span className="mb-3 flex w-fit items-center gap-1 rounded-full bg-[#12141f] px-3 py-1 text-[11px] font-bold text-emerald-300">
                  <Zap className="h-3 w-3" /> الأكثر اختياراً
                </span>
              )}
              <div className="text-lg font-bold text-slate-900">{plan.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900">${plan.price}</span>
                <span className="text-sm text-slate-400">/ شهرياً</span>
              </div>
              <div className="mt-1 text-xs font-medium text-emerald-600">
                {plan.messages.toLocaleString('ar')} رسالة شهرياً
              </div>
              <ul className="mt-4 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
                    {f.includes('POS') && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        جديد
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent}
                onClick={() => {
                  setPlan(plan.id, plan.messages)
                  toast.success(`تم التبديل إلى الباقة ${plan.name} وتجديد رصيد الرسائل`)
                }}
                className={cn(
                  'mt-6 rounded-lg py-2.5 text-sm font-bold transition-colors',
                  isCurrent
                    ? 'cursor-default bg-slate-100 text-slate-400'
                    : 'bg-[#12141f] text-white hover:bg-slate-800',
                )}
              >
                {isCurrent ? 'باقتك الحالية' : 'اشترك الآن'}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-slate-400">
        الدفع آمن ومشفّر عبر Stripe — يتم تفعيل حسابك وتجديد رصيدك تلقائياً فور إتمام الدفع
      </p>
    </div>
  )
}
