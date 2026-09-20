/**
 * باقي endpoints المنصة — الباقات، الاشتراك، المساعدون، المحادثات، POS
 */
import { api } from './api';
import type { Plan } from './auth';

// ─── الباقات ───────────────────────────────────────────────────────────────
export async function getPlans(): Promise<Plan[]> {
  const data = await api.get<{ plans: Plan[] }>('/plans');
  return data.plans;
}

export async function checkout(planId: string): Promise<{ checkout_url: string }> {
  return api.post('/subscription/checkout', { plan_id: planId });
}

// ─── المساعدون (رفيق / رفيقة) ──────────────────────────────────────────────
export interface AssistantSetting {
  id: number;
  assistant: 'rafiq' | 'rafiqa';
  active: boolean;
  tone: string | null;
  prompt: string | null;
  skills: string[];
  voice: string | null;
  working_hours: string | null;
}

export async function getAssistant(a: 'rafiq' | 'rafiqa') {
  return (await api.get<{ assistant: AssistantSetting }>(`/assistants/${a}`)).assistant;
}

export async function updateAssistant(
  a: 'rafiq' | 'rafiqa',
  payload: Partial<Omit<AssistantSetting, 'id' | 'assistant'>>,
) {
  return (await api.put<{ assistant: AssistantSetting }>(`/assistants/${a}`, payload)).assistant;
}

// ─── المحادثات ─────────────────────────────────────────────────────────────
export interface Conversation {
  id: number;
  customer_name: string | null;
  phone: string;
  category: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread: boolean;
  messages_count?: number;
}

export interface ConversationDetail extends Conversation {
  messages: { id: number; direction: 'in' | 'out'; text: string; via: string; created_at: string }[];
}

export async function getConversations() {
  return api.get<{ data: Conversation[] }>('/conversations');
}

export async function getConversation(id: number) {
  return (await api.get<{ conversation: ConversationDetail }>(`/conversations/${id}`)).conversation;
}

// ─── POS ───────────────────────────────────────────────────────────────────
export interface PosConnection {
  id: number;
  name: string;
  base_url: string;
  active: boolean;
  last_synced_at: string | null;
}

export async function getPosConnection() {
  return (await api.get<{ connection: PosConnection | null }>('/pos/connection')).connection;
}

export async function savePosConnection(payload: { name?: string; base_url: string; api_key: string }) {
  return api.post<{ connection: PosConnection; license_key: string }>('/pos/connection', payload);
}

export async function getPosSummary(): Promise<Record<string, unknown>> {
  return (await api.get<{ summary: Record<string, unknown> }>('/pos/summary')).summary;
}
