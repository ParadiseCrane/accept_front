import { MantineTransition, Menu } from '@mantine/core';

import { FC, ReactNode, memo } from 'react';
import styles from './dropdown.module.css';
import Link from 'next/link';

interface Item {
  label: string;
  href: string;
}

const Dropdown: FC<{
  items: Item[];
  children: ReactNode;
  transition?: MantineTransition;
  transitionDuration?: number;
}> = ({ items, children, transition, transitionDuration }) => {
  return (
    <Menu
      position="bottom-start"
      offset={8}
      trigger="hover"
      zIndex={1000}
      openDelay={200}
      closeDelay={200}
      transitionProps={
        transition
          ? {
              transition: transition,
              duration: transitionDuration || 150,
            }
          : undefined
      }
    >
      <Menu.Target>
        <div>{children}</div>
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item, index) => (
          <Menu.Item
            className={styles.item}
            key={index}
            component={Link}
            href={item.href}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default memo(Dropdown);
