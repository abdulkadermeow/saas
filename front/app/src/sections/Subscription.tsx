import { useEffect, useState } from 'react'
import { Check, Zap, Loader2, Crown } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useStore } from '@/hooks/useStore'
import { getPlans } from '@/lib/rafiq'
import type { Plan } from '@/lib/auth'
import { PLANS as DEMO_PLANS } from '@/data/demo'

export default function Subscription() {
  const { planId, subscription, needsSubscription, messageBalance, messageTotal, renewsAt, checkoutPlan, refreshMe } =
    useStore()

  const [plans, setPlans] = useState<Plan[] | null>(null)
  const [payingId, setPayingId] = useState<string | null>(null)

  // الباقات الحقيقية من الباك (مع fallback للوهمية إذا فشل الطلب)
  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(() => setPlans(DEMO_PLANS as unknown as Plan[]))
  }, [])

  // عند الرجوع من Stripe: نعيد فحص الاشتراك — إذا نجح الـ webhook تنفتح البوابة
  useEffect(() => {
    refreshMe().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const usedPct = messageTotal > 0 ? Math.round(((messageTotal - messageBalance) / messageTotal) * 100) : 0

  const subscribe = async (id: string) => {
    setPayingId(id)
    try {
      // بيحوّل المتصفح لصفحة Stripe Checkout مباشرة
      await checkoutPlan(id)
    } catch (err: any) {
      toast.error(err.message ?? 'تعذّر إنشاء جلسة الدفع، حاول مرة أخرى')
      setPayingId(null)
    }
  }

  if (plans === null) {
    return (
      <div className="flex min-h-64 items-center justify-center text-sm text-slate-400">
        جاري تحميل الباقات...
      </div>
    )
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* حالة الاشتراك الحالية */}
      {subscription ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500">باقتك الحالية</div>
              <div className="mt-1 flex items-center gap-3">
                <span className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
                  <Crown className="h-5 w-5 text-amber-500" />
                  {subscription.plan?.name ?? subscription.plan_id}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  {subscription.status === 'active' ? 'نشطة' : subscription.status}
                </span>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {renewsAt
                  ? `تتجدد في ${new Date(renewsAt).toLocaleDateString('ar', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : '—'}
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
      ) : (
        needsSubscription && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <div className="text-lg font-bold text-emerald-900">خطوة أخيرة لتفعيل حسابك!</div>
            <p className="mt-1 text-sm text-emerald-700">
              اختر الباقة المناسبة — يتم التفعيل وتجديد رصيدك تلقائياً فور إتمام الدفع
            </p>
          </div>
        )
      )}

      {/* الباقات */}
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = subscription !== null && plan.id === planId
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
                disabled={isCurrent || payingId !== null}
                onClick={() => subscribe(plan.id)}
                className={cn(
                  'mt-6 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-colors',
                  isCurrent
                    ? 'cursor-default bg-slate-100 text-slate-400'
                    : 'bg-[#12141f] text-white hover:bg-slate-800 disabled:opacity-60',
                )}
              >
                {payingId === plan.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري التحويل لصفحة الدفع...
                  </>
                ) : isCurrent ? (
                  'باقتك الحالية'
                ) : (
                  'اشترك الآن'
                )}
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
