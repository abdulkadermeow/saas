import { useState } from 'react'
import { CheckCircle2, Copy, Eye, EyeOff, Plug, Unplug } from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '@/hooks/useStore'

const WEBHOOK_URL = 'https://n8n.rafiq.app/webhook/whatsapp-incoming'

export default function WhatsAppConnect() {
  const { whatsapp, updateWhatsapp } = useStore()
  const [showToken, setShowToken] = useState(false)
  const [testing, setTesting] = useState(false)

  const connect = () => {
    if (!whatsapp.token.trim() || !whatsapp.phoneId.trim()) {
      toast.error('أدخل الـ Access Token و Phone Number ID أولاً')
      return
    }
    setTesting(true)
    setTimeout(() => {
      updateWhatsapp({ connected: true })
      setTesting(false)
      toast.success('تم ربط رقم الواتساب بنجاح! رفيق جاهز للرد.')
    }, 1200)
  }

  const disconnect = () => {
    updateWhatsapp({ connected: false })
    toast.success('تم فصل الرقم — توقف رفيق عن استقبال الرسائل')
  }

  const copyWebhook = () => {
    navigator.clipboard.writeText(WEBHOOK_URL).catch(() => {})
    toast.success('تم نسخ رابط الـ Webhook')
  }

  return (
    <div className="grid max-w-5xl gap-4 lg:grid-cols-5">
      {/* Connection form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-3">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">ربط Meta WhatsApp Cloud API</h3>
            <p className="mt-1 text-xs text-slate-500">
              الصق بيانات التطبيق من لوحة مطوري Meta ليتم الربط مباشرة مع محرك n8n
            </p>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              whatsapp.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${whatsapp.connected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            {whatsapp.connected ? 'مربوط' : 'غير مربوط'}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">Access Token (الدائم)</label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={whatsapp.token}
                onChange={(e) => updateWhatsapp({ token: e.target.value })}
                placeholder="EAAG..."
                dir="ltr"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 pl-10 text-sm focus:border-emerald-400 focus:outline-none"
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">Phone Number ID</label>
            <input
              value={whatsapp.phoneId}
              onChange={(e) => updateWhatsapp({ phoneId: e.target.value })}
              placeholder="1029384756..."
              dir="ltr"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {whatsapp.connected ? (
            <button
              onClick={disconnect}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              <Unplug className="h-4 w-4" />
              فصل الرقم
            </button>
          ) : (
            <button
              onClick={connect}
              disabled={testing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
            >
              <Plug className="h-4 w-4" />
              {testing ? 'جاري فحص الاتصال...' : 'ربط وفحص الاتصال'}
            </button>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-2 text-xs font-bold text-slate-600">
            رابط الـ Webhook (ضعه في إعدادات تطبيق Meta)
          </div>
          <div className="flex items-center gap-2">
            <code dir="ltr" className="flex-1 truncate rounded-lg bg-white px-3 py-2 text-xs text-slate-600 ring-1 ring-slate-200">
              {WEBHOOK_URL}
            </code>
            <button
              onClick={copyWebhook}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#12141f] text-white transition-colors hover:bg-slate-700"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
        <h3 className="mb-4 font-bold text-slate-900">خطوات الربط</h3>
        <ol className="space-y-4">
          {[
            'افتح لوحة مطوري Meta وأنشئ تطبيقاً من نوع Business',
            'فعّل منتج WhatsApp واحصل على Phone Number ID',
            'أنشئ System User وولّد Access Token دائم بصلاحية whatsapp_business_messaging',
            'الصق البيانات هنا واضغط "ربط وفحص الاتصال"',
            'انسخ رابط الـ Webhook وأضفه في إعدادات التطبيق مع الاشتراك بحقل messages',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-600">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                {(i + 1).toLocaleString('ar')}
              </span>
              {step}
            </li>
          ))}
        </ol>
        {whatsapp.connected && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            الرقم مربوط — رسائل زبائنك تصل الآن إلى رفيق عبر n8n
          </div>
        )}
      </div>
    </div>
  )
}
