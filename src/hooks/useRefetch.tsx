import { useCallback, useEffect, useState } from 'react';

interface IRequestData {
  loading: boolean;
  updatesCounter: number;
}

const COUNTER_LIMIT = 1000;

export function useRefetch(
  func: () => Promise<any>,
  updateIntervalSeconds: number
): IRequestData {
  const [updatesCounter, setUpdatesCounter] = useState(0);
  const [loading, setLoading] = useState(false);

  const funcWrapper = useCallback(
    (loading: boolean) => {
      if (loading) return;
      setLoading(true);
      func()
        .then(() => {
          setUpdatesCounter(
            (counter) => (counter % COUNTER_LIMIT) + 1
          );
          setLoading(false);
        })
        .catch(() => {});
    },
    [func]
  );

  useEffect(() => {
    if (loading) return;
    const timeout = setTimeout(() => {
      funcWrapper(false);
    }, updateIntervalSeconds * 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [funcWrapper, updateIntervalSeconds, loading]);

  return { updatesCounter, loading };
}
