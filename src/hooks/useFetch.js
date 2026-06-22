import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

/**
 * useFetch(path)
 * Fetches `path` on mount and whenever `refetch()` is called.
 * Returns { data, loading, error, refetch }
 */
const useFetch = (path) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(path);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export default useFetch;
