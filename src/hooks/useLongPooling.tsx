import { useCallback, useEffect, useState } from 'react';

import { useRefetch } from './useRefetch';

interface IRequestData {
  loading: boolean;
  firstLoad: boolean;
  updatesCounter: number;
}

export function useLongPooling(
  func: (_: boolean) => Promise<any>,
  updateIntervalSeconds: number
): IRequestData {
  const [firstLoad, setFirstLoad] = useState(true);
  const longPooling = useCallback(() => func(false), [func]);

  useEffect(() => {
    func(true).then(() => setFirstLoad(false));
  }, [func]);

  const { loading, updatesCounter } = useRefetch(
    longPooling,
    updateIntervalSeconds
  );

  return { updatesCounter, loading, firstLoad };
}
