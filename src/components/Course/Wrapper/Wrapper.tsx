import { FC, ReactNode } from 'react';
import styles from './styles.module.css';

export const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};
