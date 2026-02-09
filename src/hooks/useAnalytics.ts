import { useEffect, useState } from "react";

interface UmamiInstance {
  track: (name: string, data?: object) => void;
}

export const useAnalytics = (): undefined | UmamiInstance => {
  let [umamiInstance, setUmamiInstance] = useState(undefined);

  useEffect(() => {
    if (window) {
      // @ts-expect-error
      setUmamiInstance(window.umami);
    }
  }, []);

  return umamiInstance;
};
