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

  const funcWrapper = useCallback(() => {
    if (loading) return;
    setLoading(true);
    func()
      .then(() => {
        setUpdatesCounter((counter) => (counter % COUNTER_LIMIT) + 1);
      })
      .catch(() => {})
      .then(() => {
        setTimeout(() => setLoading(false), updateIntervalSeconds);
      });
  }, [func, updateIntervalSeconds]);

  useEffect(() => {
    if (loading) return;
    funcWrapper();
  }, [funcWrapper]); // eslint-disable-line

  return { updatesCounter, loading };
}
