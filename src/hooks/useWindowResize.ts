import { useEffect, useState } from 'react';

export function useWindowWidth(): number | undefined {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
}
