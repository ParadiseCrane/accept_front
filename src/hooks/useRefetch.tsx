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
  const [loading, setLoading] = useState(true);

  const funcWrapper = useCallback(() => {
    setLoading(true);
    func()
      .then(() => {
        setUpdatesCounter((counter) => (counter % COUNTER_LIMIT) + 1);
        setLoading(false);
      })
      .catch(() => setLoading(false))
      .then(() => {
        setTimeout(funcWrapper, updateIntervalSeconds);
      });
  }, [func, updateIntervalSeconds]);

  useEffect(() => {
    funcWrapper();
  }, []); // eslint-disable-line

  return { updatesCounter, loading };
}
