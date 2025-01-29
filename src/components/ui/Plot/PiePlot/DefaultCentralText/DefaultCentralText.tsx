import { IPlotData } from '@custom-types/ui/IPlot';
import { FC, memo } from 'react';

import styles from './defaultCentralText.module.css';

const DefaultCentralText: FC<IPlotData> = ({ color, label, amount }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.name} style={{ color }}>
        {label}
      </div>
      <div className={styles.amount}>{amount}</div>
    </div>
  );
};

export default memo(DefaultCentralText);
