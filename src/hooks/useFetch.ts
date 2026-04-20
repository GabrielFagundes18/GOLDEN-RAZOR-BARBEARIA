import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
  
    if (!url) return;

    setLoading(true);
    try {
      const res = await api.get(url);
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error("Erro na requisição Ninja:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, mutate };
}