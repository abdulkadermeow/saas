/**
 * طبقة الاتصال بالـ API — كل الطلبات بتمر من هون.
 * بتقرأ الرابط من .env (VITE_API_BASE_URL) وبتبعت التوكن تلقائياً.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  const token = localStorage.getItem('token');
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, any>;

  // التوكن انتهى/باطل → طرد لصفحة الدخول
  if (res.status === 401 && !path.startsWith('/auth/')) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  if (!res.ok) {
    const msg: string =
      data.message ?? (res.status === 422 ? 'تحقق من الحقول المدخلة' : 'حدث خطأ غير متوقع');
    throw new ApiError(res.status, msg, data.errors);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
};
