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
  checkHash: (_: T, hash: string) => boolean
): [T, UseMoveThroughArrayHandlers<T>, StateArray<T>] {
  const [state, setState] = useState<StateArray<T>>({
    array: initialValue,
    current: 0,
  });

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
    []
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
      setState((currentState) => ({
        array: currentState.array,
        current: Math.max(0, currentState.current - steps),
      })),
    []
  );

  const next = useCallback(
    (steps = 1) =>
      setState((currentState) => ({
        array: currentState.array,
        current: Math.min(
          currentState.array.length - 1,
          currentState.current + steps
        ),
      })),
    []
  );

  const handlers = useMemo(
    () => ({ current, currentByHash, prev, next }),
    [current, currentByHash, prev, next]
  );

  return [state.array[state.current], handlers, state];
}
