import type { ReactNode } from 'react'
import {
  LayoutDashboard,
  MessagesSquare,
  Bot,
  Plug,
  CreditCard,
  LogOut,
  MessageCircle,
  PhoneCall,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/hooks/useStore'

export type PageKey = 'overview' | 'conversations' | 'assistants' | 'whatsapp' | 'subscription'

const NAV: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { key: 'conversations', label: 'المحادثات والعملاء', icon: MessagesSquare },
  { key: 'assistants', label: 'المساعدون', icon: Bot },
  { key: 'whatsapp', label: 'ربط الواتساب', icon: Plug },
  { key: 'subscription', label: 'الاشتراك والباقات', icon: CreditCard },
]

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-block h-2 w-2 rounded-full',
        active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]' : 'bg-slate-500',
      )}
    />
  )
}

export default function Layout({
  page,
  onNavigate,
  children,
}: {
  page: PageKey
  onNavigate: (p: PageKey) => void
  children: ReactNode
}) {
  const { user, rafiq, rafiqa, logout, messageBalance, planId, conversations } = useStore()
  const unread = conversations.filter((c) => c.unread).length

  return (
    <div className="flex min-h-screen bg-[#f5f6f8] text-slate-800" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 right-0 z-30 flex w-64 flex-col bg-[#12141f] text-slate-300">
        <div className="flex items-center gap-3 px-6 pt-7 pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white">رفيق ورفيقة</div>
            <div className="text-[11px] text-slate-500">منصة المساعدين الأذكياء</div>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                page === item.key
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span className="flex-1 text-right">{item.label}</span>
              {item.key === 'conversations' && unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-bold text-[#12141f]">
                  {unread}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bot status */}
        <div className="mx-3 mb-3 rounded-xl bg-white/5 p-3">
          <div className="mb-2 text-[11px] font-medium text-slate-500">حالة المساعدين</div>
          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4 text-emerald-400" /> رفيق — شات واتساب
            </span>
            <StatusDot active={rafiq.active} />
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="flex items-center gap-2 text-sm">
              <PhoneCall className="h-4 w-4 text-sky-400" /> رفيقة — مكالمات
            </span>
            <StatusDot active={rafiqa.active} />
          </div>
        </div>

        {/* Balance + user */}
        <div className="mx-3 mb-4 rounded-xl bg-white/5 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">رصيد الرسائل</span>
            <span className="font-bold text-emerald-300">{messageBalance.toLocaleString('ar')}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2">
            <span className="truncate text-slate-300">{user?.name}</span>
            <button
              onClick={logout}
              title="تسجيل الخروج"
              className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="mr-64 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur">
          <h1 className="text-lg font-bold text-slate-900">
            {NAV.find((n) => n.key === page)?.label}
          </h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              الباقة {planId === 'basic' ? 'الأساسية' : planId === 'pro' ? 'الاحترافية' : 'الأعمال'}
            </span>
            <span className="text-slate-500">{user?.email}</span>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
