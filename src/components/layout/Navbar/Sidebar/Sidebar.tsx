import { IHeaderLink } from '@custom-types/ui/IHeaderLink';
import { useLocale } from '@hooks/useLocale';
import { Burger, Drawer } from '@mantine/core';
import { FC, useState } from 'react';

import Logo from '../Logo/Logo';
import { Links } from './Links';
import styles from './sideBar.module.css';

export const Sidebar: FC<{
  links: IHeaderLink[];
  dropdown: IHeaderLink[];
}> = ({ links, dropdown }) => {
  const [open, setOpen] = useState(false);
  const { locale } = useLocale();

  return (
    <div>
      <Burger
        className={styles.burger}
        size="md"
        opened={false}
        onClick={() => setOpen(true)}
      />
      <div className={styles.sideBarWrapper}>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>
        <Drawer
          position="top"
          opened={open}
          onClose={() => setOpen(false)}
          size={'0px'}
        >
          <div className={styles.drawerContent}>
            <Links
              links={links}
              dropdownLinks={dropdown}
              dropdownLabel={locale.mainHeaderLinks.projects}
              onClose={() => setOpen(false)}
            />
          </div>
        </Drawer>
      </div>
    </div>
  );
};
