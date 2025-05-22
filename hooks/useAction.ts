import { useState, useCallback } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useAction<T, Args extends any[]>(
  action: (...args: Args) => Promise<T>
) {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);

  const invoke = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      setStatus('loading');
      setError(null);
      try {
        const result = await action(...args);
        setData(result);
        setStatus('success');
        return result;
      } catch (err) {
        setError(err);
        setStatus('error');
      }
    },
    [action]
  );

  return { status, data, error, invoke };
}
