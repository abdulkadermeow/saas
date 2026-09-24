import { useState } from 'react'
import { MessageCircle, PhoneCall, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '@/hooks/useStore'

export default function Login() {
  const { login, register } = useStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error('يرجى تعبئة البريد الإلكتروني وكلمة المرور')
      return
    }
    if (mode === 'register' && !name.trim()) {
      toast.error('يرجى إدخال اسم المتجر / الشركة')
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email.trim(), password.trim())
      } else {
        await register(name.trim(), email.trim(), password.trim())
      }
      // لا حاجة لأي redirect — App.tsx تلقائياً بيحول:
      //   ما في اشتراك → صفحة اختيار الباقة | في اشتراك → الداشبورد
    } catch (err: any) {
      toast.error(err.message ?? 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#12141f] p-6" dir="rtl">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <MessageCircle className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">رفيق ورفيقة</h1>
          <p className="mt-2 text-sm text-slate-400">
            سجّل دخولك لإدارة مساعديك الأذكياء على واتساب والمكالمات
          </p>
        </div>

        {/* تبديل بين الدخول وإنشاء حساب */}
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-lg py-2 text-sm font-bold transition-colors ${
              mode === 'login' ? 'bg-emerald-500 text-[#12141f]' : 'text-slate-400 hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`rounded-lg py-2 text-sm font-bold transition-colors ${
              mode === 'register' ? 'bg-emerald-500 text-[#12141f]' : 'text-slate-400 hover:text-white'
            }`}
          >
            حساب جديد
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
          {mode === 'register' && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">اسم المتجر / الشركة</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: متجر الأناقة"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
            />
            {mode === 'register' && (
              <p className="mt-1 text-xs text-slate-500">8 أحرف على الأقل، مع حرف كبير وحرف صغير ورقم</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-bold text-[#12141f] transition-colors hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              <>
                {mode === 'login' ? 'دخول لوحة التحكم' : 'إنشاء الحساب'}
                <ArrowLeft className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> رفيق — شات بوت واتساب
          </span>
          <span className="flex items-center gap-1.5">
            <PhoneCall className="h-3.5 w-3.5 text-sky-400" /> رفيقة — رد على المكالمات
          </span>
        </div>
      </div>
    </div>
  )
}
