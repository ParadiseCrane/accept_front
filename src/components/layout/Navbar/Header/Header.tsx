import { IHeaderLink } from '@custom-types/ui/IHeaderLink';
import { FC, memo } from 'react';

import Logo from '../Logo/Logo';
import styles from './header.module.css';
import Links from './Links/Links';

const Header: FC<{
  links: IHeaderLink[];
}> = ({ links }) => {
  return (
    <div className={styles.header}>
      <Logo />
      <Links links={links} />
    </div>
  );
};

export default memo(Header);
