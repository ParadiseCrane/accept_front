import Header from '@components/layout/Navbar/Header/Header';
import { links } from '@constants/MainHeaderLinks';
import { FC, memo } from 'react';

import styles from './navbar.module.css';

const Navbar: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Header links={links} />
    </div>
  );
};

export default memo(Navbar);
