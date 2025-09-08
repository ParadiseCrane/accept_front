import { useCallback, useEffect, useMemo, useState } from "react";

export interface UseMoveThroughArrayHandlers<T> {
  current: (item: T) => void;
  prev: (steps?: number) => void;
  next: (steps?: number) => void;
}

export function useMoveThroughArray<T>(
  start: number,
  array: T[],
  eq: (_: T, __: T) => boolean,
  onChange: (newItem: T) => void,
): [T, UseMoveThroughArrayHandlers<T>] {
  const [currentIndex, setCurrentIndex] = useState(start);
  const currentValue = useMemo(
    () => array[currentIndex],
    [currentIndex, array],
  );

  useEffect(
    () => onChange(array[currentIndex]),
    [array, currentIndex, onChange],
  );

  const current = useCallback(
    (item: T) => {
      const newIndex = array.findIndex((arrayItem) => eq(arrayItem, item));
      if (newIndex == -1) return;
      setCurrentIndex(newIndex);
    },
    [array, eq],
  );

  const prev = useCallback(
    (steps = 1) =>
      setCurrentIndex((lastIndex) => {
        const newIndex = Math.max(0, lastIndex - steps);
        return newIndex;
      }),
    [],
  );

  const next = useCallback(
    (steps = 1) =>
      setCurrentIndex((lastIndex) => {
        const newIndex = Math.min(array.length - 1, lastIndex + steps);
        return newIndex;
      }),
    [array],
  );

  const handlers = useMemo(
    () => ({ current, prev, next }),
    [current, prev, next],
  );

  return [currentValue, handlers];
}
