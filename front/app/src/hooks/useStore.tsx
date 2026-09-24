import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AssistantConfig, Conversation } from '@/types'
import { DEFAULT_PROMPTS } from '@/data/demo'
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  me as apiMe,
  type Subscription,
} from '@/lib/auth'
import { getAssistant, updateAssistant, getConversations, checkout } from '@/lib/rafiq'

interface User {
  id?: number
  name: string
  email: string
}

interface StoreState {
  user: User | null
  subscription: Subscription | null
  bootstrapped: boolean
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
  needsSubscription: boolean
  subscriptionDepleted: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
  checkoutPlan: (planId: string) => Promise<void>
  updateRafiq: (patch: Partial<AssistantConfig>) => void
  updateRafiqa: (patch: Partial<AssistantConfig>) => void
  updateWhatsapp: (patch: Partial<StoreState['whatsapp']>) => void
  setPlan: (planId: string, total: number) => void
  markRead: (id: string) => void
  sendReply: (convId: string, text: string) => void
}

const initialState: StoreState = {
  user: null,
  subscription: null,
  bootstrapped: false,
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
  planId: '',
  messageBalance: 0,
  messageTotal: 0,
  renewsAt: '',
  conversations: [],
}

// الـ WhatsApp connection يبقى محفوظاً محلياً (لا endpoint له بالباك حالياً)
const WA_KEY = 'rafiq-whatsapp-v1'

function loadWhatsapp() {
  try {
    const raw = localStorage.getItem(WA_KEY)
    if (raw) return { ...initialState.whatsapp, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return initialState.whatsapp
}

function applySubscription(sub: Subscription | null) {
  return {
    subscription: sub,
    planId: sub?.plan_id ?? '',
    messageTotal: sub?.messages_total ?? 0,
    messageBalance: sub?.messages_remaining ?? 0,
    renewsAt: sub?.renews_at ?? '',
  }
}

function adaptAssistant(a: any, fallback: AssistantConfig): AssistantConfig {
  return {
    ...fallback,
    active: a?.active ?? fallback.active,
    tone: a?.tone ?? fallback.tone,
    prompt: a?.prompt ?? fallback.prompt,
    skills: a?.skills?.length ? a.skills : fallback.skills,
    voice: a?.voice ?? fallback.voice,
    workingHours: a?.working_hours ?? fallback.workingHours,
  }
}

function adaptConversation(c: any): any {
  return {
    id: String(c.id),
    name: c.customer_name ?? c.phone,
    phone: c.phone,
    category: c.category,
    lastMessage: c.last_message ?? '',
    lastTime: c.last_message_at ? new Date(c.last_message_at).toLocaleString('ar') : '',
    unread: c.unread,
    messages: [],
  }
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>({ ...initialState, whatsapp: loadWhatsapp() })

  // حفظ حالة WhatsApp محلياً فقط
  useEffect(() => {
    try {
      localStorage.setItem(WA_KEY, JSON.stringify(state.whatsapp))
    } catch {
      /* ignore */
    }
  }, [state.whatsapp])

  /** سحب كل بيانات المستخدم من الباك بعد الدخول/التحديث */
  const refreshAll = useCallback(async () => {
    const m = await apiMe()
    const patch: any = { user: { id: m.user.id, name: m.user.name, email: m.user.email } }
    Object.assign(patch, applySubscription(m.subscription))

    try {
      patch.rafiq = adaptAssistant(await getAssistant('rafiq'), initialState.rafiq)
    } catch {
      /* keep defaults */
    }
    try {
      patch.rafiqa = adaptAssistant(await getAssistant('rafiqa'), initialState.rafiqa)
    } catch {
      /* keep defaults */
    }
    try {
      const convs = await getConversations()
      patch.conversations = (convs.data ?? []).map(adaptConversation)
    } catch {
      /* keep empty */
    }

    setState((s) => ({ ...s, ...patch }))
  }, [])

  // عند فتح التطبيق: إذا في توكن → جيب البيانات الحقيقية
  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('token')) {
        setState((s) => ({ ...s, bootstrapped: true }))
        return
      }
      try {
        await refreshAll()
      } catch {
        localStorage.removeItem('token')
      } finally {
        setState((s) => ({ ...s, bootstrapped: true }))
      }
    })()
  }, [refreshAll])

  const login = useCallback(
    async (email: string, password: string) => {
      await apiLogin(email, password)
      await refreshAll()
    },
    [refreshAll],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await apiRegister(name, email, password)
      await refreshAll()
    },
    [refreshAll],
  )

  const logout = useCallback(async () => {
    apiLogout().catch(() => {})
    setState((s) => ({
      ...s,
      user: null,
      subscription: null,
      conversations: [],
      ...applySubscription(null),
    }))
  }, [])

  const refreshMe = useCallback(async () => {
    await refreshAll()
  }, [refreshAll])

  /** الاشتراك بباقة → يفتح صفحة الدفع بـ Stripe */
  const checkoutPlan = useCallback(async (planId: string) => {
    const { checkout_url } = await checkout(planId)
    window.location.href = checkout_url
  }, [])

  const pushAssistantUpdate = useCallback((assistant: 'rafiq' | 'rafiqa', cfg: AssistantConfig) => {
    updateAssistant(assistant, {
      active: cfg.active,
      tone: cfg.tone,
      prompt: cfg.prompt,
      skills: cfg.skills,
      voice: cfg.voice,
      working_hours: cfg.workingHours,
    }).catch(() => {})
  }, [])

  const updateRafiq = useCallback(
    (patch: Partial<AssistantConfig>) => {
      setState((s) => {
        const next = { ...s.rafiq, ...patch }
        pushAssistantUpdate('rafiq', next)
        return { ...s, rafiq: next }
      })
    },
    [pushAssistantUpdate],
  )

  const updateRafiqa = useCallback(
    (patch: Partial<AssistantConfig>) => {
      setState((s) => {
        const next = { ...s.rafiqa, ...patch }
        pushAssistantUpdate('rafiqa', next)
        return { ...s, rafiqa: next }
      })
    },
    [pushAssistantUpdate],
  )

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
                { id: `m${Date.now()}`, from: 'bot' as const, text, time: 'الآن', via: 'rafiq' as const },
              ],
            }
          : c,
      ),
    }))
  }, [])

  const value = useMemo<Store>(() => {
    const needsSubscription = state.user !== null && state.subscription === null
    const subscriptionDepleted =
      state.subscription !== null && state.subscription.messages_remaining <= 0
    return {
      ...state,
      needsSubscription,
      subscriptionDepleted,
      login,
      register,
      logout,
      refreshMe,
      checkoutPlan,
      updateRafiq,
      updateRafiqa,
      updateWhatsapp,
      setPlan,
      markRead,
      sendReply,
    }
  }, [
    state,
    login,
    register,
    logout,
    refreshMe,
    checkoutPlan,
    updateRafiq,
    updateRafiqa,
    updateWhatsapp,
    setPlan,
    markRead,
    sendReply,
  ])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
