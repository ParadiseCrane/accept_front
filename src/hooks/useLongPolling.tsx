import { useCallback, useEffect, useState } from "react";

import { useRefetch } from "./useRefetch";

interface IRequestData {
  loading: boolean;
  firstLoad: boolean;
  updatesCounter: number;
}

export function useLongPolling(
  func: (_: boolean) => Promise<any>,
  updateIntervalSeconds: number,
): IRequestData {
  const [firstLoad, setFirstLoad] = useState(true);
  const longPolling = useCallback(() => func(false), [func]);

  useEffect(() => {
    func(true).then(() => setFirstLoad(false));
  }, [func]);

  const { loading, updatesCounter } = useRefetch(
    longPolling,
    updateIntervalSeconds,
  );

  return { updatesCounter, loading, firstLoad };
}
