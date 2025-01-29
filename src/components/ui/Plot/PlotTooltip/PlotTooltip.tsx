import { FC, ReactNode, memo, useCallback, useEffect, useState } from 'react';

import styles from './plotTooltip.module.css';

const PlotTooltip: FC<{ children?: ReactNode }> = ({ children }) => {
  const [coords, setCoords] = useState([0, 0]);

  const processMouseEvent = useCallback((event: MouseEvent) => {
    setCoords([event.pageX + 15, event.pageY - 40]);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', processMouseEvent);
    return () => {
      window.removeEventListener('mousemove', processMouseEvent);
    };
  }, [processMouseEvent]);
  return (
    <div
      className={styles.wrapper}
      style={{
        display: children === undefined ? 'none' : 'block',
        left: coords[0],
        top: coords[1],
      }}
    >
      {children}
    </div>
  );
};

export default memo(PlotTooltip);
