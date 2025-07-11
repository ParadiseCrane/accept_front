import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

export interface UseMoveThroughArrayHandlers<T> {
  current: (item: T) => void;
  currentByHash: (hash: string) => void;
  prev: (steps?: number) => void;
  next: (steps?: number) => void;
}

export interface StateArray<T> {
  array: T[];
  current: number;
}

export function useMoveThroughArray<T>(
  initialValue: T[],
  checkHash: (_: T, hash: string) => boolean,
  routeToPush: (item: T) => string
): [T, UseMoveThroughArrayHandlers<T>, StateArray<T>] {
  const [state, setState] = useState<StateArray<T>>({
    array: initialValue,
    current: 0,
  });
  const router = useRouter();

  const currentByHash = useCallback(
    (hash: string) =>
      setState((currentState) => {
        const index = currentState.array.findIndex((item) =>
          checkHash(item, hash)
        );
        if (index == -1) return currentState;
        return {
          array: currentState.array,
          current: index,
        };
      }),
    [checkHash]
  );

  const current = useCallback(
    (item: T) =>
      setState((currentState) => {
        const index = currentState.array.indexOf(item);
        if (index == -1) return currentState;
        return {
          array: currentState.array,
          current: index,
        };
      }),
    []
  );

  const prev = useCallback(
    (steps = 1) =>
      setState((currentState) => {
        const newIndex = Math.max(0, currentState.current - steps);
        router.replace(routeToPush(currentState.array[newIndex]));
        return {
          array: currentState.array,
          current: newIndex,
        };
      }),
    [router, routeToPush]
  );

  const next = useCallback(
    (steps = 1) =>
      setState((currentState) => {
        const newIndex = Math.min(
          currentState.array.length - 1,
          currentState.current + steps
        );
        router.replace(routeToPush(currentState.array[newIndex]));
        return {
          array: currentState.array,
          current: newIndex,
        };
      }),
    [router, routeToPush]
  );

  const handlers = useMemo(
    () => ({ current, currentByHash, prev, next }),
    [current, currentByHash, prev, next]
  );

  return [state.array[state.current], handlers, state];
}
