/**
 * Hook بيجيب المستخدم + الاشتراك عند تحميل أي صفحة محميّة
 */
import { useCallback, useEffect, useState } from 'react';
import { me, type MeResponse } from '../lib/auth';

export function useMe() {
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setData(await me());
    } catch (e: any) {
      setError(e.message ?? 'تعذّر تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
