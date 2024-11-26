import { RefObject, useEffect, useRef } from 'react';

function useEventListener<K extends keyof WindowEventMap>(
  _eventName: K,
  _handler: (_event: WindowEventMap[K]) => void
): void;
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  _eventName: K,
  _handler: (_event: HTMLElementEventMap[K]) => void,
  _element: RefObject<T>
): void;

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  T extends HTMLElement | void = void
>(
  eventName: KW | KH,
  handler: (
    _event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event
  ) => void,
  element?: RefObject<T>
) {
  // Create a ref that stores handler
  const savedHandler = useRef<typeof handler>(null!);

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Update saved handler if necessary
    if (savedHandler.current !== handler) {
      savedHandler.current = handler;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener: typeof handler = (event) => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!savedHandler?.current) {
        savedHandler.current(event);
      }
    };

    targetElement.addEventListener(eventName, eventListener);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, handler]);
}

export default useEventListener;
