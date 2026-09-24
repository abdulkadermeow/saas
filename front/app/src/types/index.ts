export type LeadCategory = 'مهتم للشراء' | 'شكوى' | 'اعتراض على السعر' | 'استفسار عام'

export interface ChatMessage {
  id: string
  from: 'customer' | 'bot'
  text: string
  time: string
  via: 'rafiq' | 'rafiqa'
}

export interface Conversation {
  id: string
  customerName: string
  phone: string
  category: LeadCategory
  lastMessage: string
  lastTime: string
  unread: boolean
  messages: ChatMessage[]
}

export interface AssistantConfig {
  active: boolean
  name: string
  tone: string
  prompt: string
  skills: string[]
  voice?: string
  workingHours?: string
}

export interface DayStat {
  day: string
  messages: number
  customers: number
}

export interface Plan {
  id: string
  name: string
  price: number
  messages: number
  features: string[]
}
