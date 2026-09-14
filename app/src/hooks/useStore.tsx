import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AssistantConfig, Conversation } from '@/types'
import { DEFAULT_PROMPTS, DEMO_CONVERSATIONS } from '@/data/demo'

interface User {
  name: string
  email: string
}

interface StoreState {
  user: User | null
  rafiq: AssistantConfig
  rafiqa: AssistantConfig
  whatsapp: { token: string; phoneId: string; connected: boolean }
  planId: string
  messageBalance: number
  messageTotal: number
  renewsAt: string
  conversations: Conversation[]
}

interface Store extends StoreState {
  login: (name: string, email: string) => void
  logout: () => void
  updateRafiq: (patch: Partial<AssistantConfig>) => void
  updateRafiqa: (patch: Partial<AssistantConfig>) => void
  updateWhatsapp: (patch: Partial<StoreState['whatsapp']>) => void
  setPlan: (planId: string, total: number) => void
  markRead: (id: string) => void
  sendReply: (convId: string, text: string) => void
}

const initialState: StoreState = {
  user: null,
  rafiq: {
    active: true,
    name: 'رفيق',
    tone: 'ودودة',
    prompt: DEFAULT_PROMPTS.rafiq,
    skills: ['الرد على الاستفسارات', 'عرض الأسعار والعروض', 'تحويل لموظف بشري'],
  },
  rafiqa: {
    active: false,
    name: 'رفيقة',
    tone: 'رسمية',
    prompt: DEFAULT_PROMPTS.rafiqa,
    skills: ['الرد على الاستفسارات', 'حجز المواعيد'],
    voice: 'رفيقة — صوت هادئ',
    workingHours: '9:00 - 21:00',
  },
  whatsapp: { token: '', phoneId: '', connected: false },
  planId: 'pro',
  messageBalance: 6842,
  messageTotal: 10000,
  renewsAt: '2026-10-01',
  conversations: DEMO_CONVERSATIONS,
}

const KEY = 'rafiq-rafiqa-store-v1'

function load(): StoreState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initialState, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return initialState
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const login = useCallback((name: string, email: string) => {
    setState((s) => ({ ...s, user: { name, email } }))
  }, [])

  const logout = useCallback(() => {
    setState((s) => ({ ...s, user: null }))
  }, [])

  const updateRafiq = useCallback((patch: Partial<AssistantConfig>) => {
    setState((s) => ({ ...s, rafiq: { ...s.rafiq, ...patch } }))
  }, [])

  const updateRafiqa = useCallback((patch: Partial<AssistantConfig>) => {
    setState((s) => ({ ...s, rafiqa: { ...s.rafiqa, ...patch } }))
  }, [])

  const updateWhatsapp = useCallback((patch: Partial<StoreState['whatsapp']>) => {
    setState((s) => ({ ...s, whatsapp: { ...s.whatsapp, ...patch } }))
  }, [])

  const setPlan = useCallback((planId: string, total: number) => {
    setState((s) => ({ ...s, planId, messageTotal: total, messageBalance: total }))
  }, [])

  const markRead = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    }))
  }, [])

  const sendReply = useCallback((convId: string, text: string) => {
    setState((s) => ({
      ...s,
      messageBalance: Math.max(0, s.messageBalance - 1),
      conversations: s.conversations.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: text,
              lastTime: 'الآن',
              messages: [
                ...c.messages,
                {
                  id: `m${Date.now()}`,
                  from: 'bot' as const,
                  text,
                  time: 'الآن',
                  via: 'rafiq' as const,
                },
              ],
            }
          : c,
      ),
    }))
  }, [])

  const value = useMemo<Store>(
    () => ({
      ...state,
      login,
      logout,
      updateRafiq,
      updateRafiqa,
      updateWhatsapp,
      setPlan,
      markRead,
      sendReply,
    }),
    [state, login, logout, updateRafiq, updateRafiqa, updateWhatsapp, setPlan, markRead, sendReply],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
