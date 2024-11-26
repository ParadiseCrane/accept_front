import { IWidth } from '@custom-types/ui/atomic';
import { useMediaQuery } from '@mantine/hooks';
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface IWidthContext {
  numberWidth: number;
  width: IWidth;
  is768: boolean;
}

const WidthContext = createContext<IWidthContext>(null!);

export const WidthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [numberWidth, setNumberWidth] = useState(320);
  const [width, setWidth] = useState<IWidth>('320');

  const is480 = useMediaQuery('(min-width: 480px)') || false;
  const is768 = useMediaQuery('(min-width: 768px)') || false;
  const is1024 = useMediaQuery('(min-width: 1024px)') || false;
  const is1280 = useMediaQuery('(min-width: 1280px)') || false;
  const is1440 = useMediaQuery('(min-width: 1440px)') || false;
  const is1920 = useMediaQuery('(min-width: 1920px)') || false;

  useEffect(() => {
    if (is1920) {
      setWidth('1920');
      setNumberWidth(1920);
    } else if (is1440) {
      setWidth('1440');
      setNumberWidth(1440);
    } else if (is1280) {
      setWidth('1280');
      setNumberWidth(1280);
    } else if (is1024) {
      setWidth('1024');
      setNumberWidth(1024);
    } else if (is768) {
      setWidth('768');
      setNumberWidth(768);
    } else if (is480) {
      setWidth('480');
      setNumberWidth(480);
    } else {
      setWidth('320');
      setNumberWidth(320);
    }
  }, [is1024, is1280, is1920, is480, is768, is1440]);

  return (
    <WidthContext.Provider value={{ numberWidth, width, is768 }}>
      {children}
    </WidthContext.Provider>
  );
};

export function useWidth() {
  return useContext(WidthContext);
}
