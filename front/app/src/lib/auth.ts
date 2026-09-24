/**
 * دوال المصادقة + الأنواع المشتركة
 */
import { api } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  messages: number;
  pos: boolean;
  features: string[];
}

export interface Subscription {
  plan_id: string;
  plan: Plan;
  status: string;
  messages_total: number;
  messages_used: number;
  messages_remaining: number;
  renews_at: string | null;
}

export interface MeResponse {
  user: User;
  subscription: Subscription | null;
  has_business_plan: boolean;
}

export async function login(email: string, password: string) {
  const data = await api.post<{ token: string; user: User }>('/auth/login', {
    email,
    password,
  });
  localStorage.setItem('token', data.token);
  return data;
}

export async function register(name: string, email: string, password: string) {
  const data = await api.post<{ token: string; user: User }>('/auth/register', {
    name,
    email,
    password,
  });
  localStorage.setItem('token', data.token);
  return data;
}

export async function me(): Promise<MeResponse> {
  return api.get<MeResponse>('/me');
}

export async function logout() {
  api.post('/auth/logout').catch(() => {});
  localStorage.removeItem('token');
  window.location.href = '/login';
}
