import { useMemo, useState } from 'react'
import { MessageCircle, PhoneCall, Send, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/hooks/useStore'
import type { LeadCategory } from '@/types'

const CATEGORY_COLORS: Record<LeadCategory, string> = {
  'مهتم للشراء': 'bg-emerald-100 text-emerald-700',
  شكوى: 'bg-red-100 text-red-700',
  'اعتراض على السعر': 'bg-amber-100 text-amber-700',
  'استفسار عام': 'bg-sky-100 text-sky-700',
}

const FILTERS: Array<'الكل' | LeadCategory> = ['الكل', 'مهتم للشراء', 'شكوى', 'اعتراض على السعر', 'استفسار عام']

export default function Conversations() {
  const { conversations, markRead, sendReply } = useStore()
  const [selectedId, setSelectedId] = useState(conversations[0]?.id ?? '')
  const [filter, setFilter] = useState<'الكل' | LeadCategory>('الكل')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')

  const list = useMemo(
    () =>
      conversations.filter(
        (c) =>
          (filter === 'الكل' || c.category === filter) &&
          (query === '' || c.customerName.includes(query) || c.phone.includes(query)),
      ),
    [conversations, filter, query],
  )

  const selected = conversations.find((c) => c.id === selectedId) ?? list[0]

  const open = (id: string) => {
    setSelectedId(id)
    markRead(id)
  }

  const send = () => {
    if (!draft.trim() || !selected) return
    sendReply(selected.id, draft.trim())
    setDraft('')
  }

  return (
    <div className="grid gap-4 xl:grid-cols-5" style={{ height: 'calc(100vh - 7.5rem)' }}>
      {/* List */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white xl:col-span-2">
        <div className="border-b border-slate-100 p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الرقم..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-9 text-sm focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  filter === f ? 'bg-[#12141f] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {list.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-400">لا توجد محادثات مطابقة</div>
          )}
          {list.map((c) => (
            <button
              key={c.id}
              onClick={() => open(c.id)}
              className={cn(
                'flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3.5 text-right transition-colors',
                selected?.id === c.id ? 'bg-emerald-50/60' : 'hover:bg-slate-50',
              )}
            >
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                  {c.customerName[0]}
                </div>
                <span className="absolute -bottom-0.5 -left-0.5 rounded-full bg-white p-0.5">
                  {c.messages[0]?.via === 'rafiqa' ? (
                    <PhoneCall className="h-3 w-3 text-sky-500" />
                  ) : (
                    <MessageCircle className="h-3 w-3 text-emerald-500" />
                  )}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    {c.customerName}
                    {c.unread && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                  </span>
                  <span className="text-[11px] text-slate-400">{c.lastTime}</span>
                </div>
                <div className="mt-0.5 truncate text-xs text-slate-500">{c.lastMessage}</div>
                <span
                  className={cn('mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold', CATEGORY_COLORS[c.category])}
                >
                  {c.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat view */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white xl:col-span-3">
        {selected ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#12141f] font-bold text-white">
                  {selected.customerName[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{selected.customerName}</div>
                  <div className="text-xs text-slate-500" dir="ltr">
                    {selected.phone}
                  </div>
                </div>
              </div>
              <span className={cn('rounded-full px-3 py-1 text-xs font-bold', CATEGORY_COLORS[selected.category])}>
                {selected.category}
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[#f5f6f8] p-5">
              {selected.messages.map((m) => (
                <div key={m.id} className={cn('flex', m.from === 'bot' ? 'justify-start' : 'justify-end')}>
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                      m.from === 'bot'
                        ? 'rounded-tr-sm bg-white text-slate-800 ring-1 ring-slate-200'
                        : 'rounded-tl-sm bg-emerald-600 text-white',
                    )}
                  >
                    {m.from === 'bot' && (
                      <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        {m.via === 'rafiqa' ? <PhoneCall className="h-3 w-3" /> : <MessageCircle className="h-3 w-3" />}
                        {m.via === 'rafiqa' ? 'رفيقة' : 'رفيق'}
                      </div>
                    )}
                    <div>{m.text}</div>
                    <div className={cn('mt-1 text-[10px]', m.from === 'bot' ? 'text-slate-400' : 'text-emerald-200')}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 p-4">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="اكتب رداً يدوياً باسم رفيق..."
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-emerald-400 focus:outline-none"
              />
              <button
                onClick={send}
                disabled={!draft.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-500 disabled:opacity-40"
              >
                <Send className="h-4 w-4 -scale-x-100" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">اختر محادثة لعرضها</div>
        )}
      </div>
    </div>
  )
}
