import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { AppShell, Group, UnstyledButton } from '@mantine/core';
import { FC, ReactNode, memo, useState } from 'react';
import styles from './leftMenu.module.css';

const LeftMenu: FC<{
  links: IMenuLink[];
  initialStep?: number;
  topContent?: ReactNode;
}> = ({ links, initialStep, topContent }) => {
  const [current, setCurrent] = useState(initialStep || 0);

  return (
    <AppShell>
      <AppShell.Navbar p="xs" w={{ base: 300 }} withBorder={false} zIndex={10}>
        {topContent && <></>}
        {/* <Navbar.Section grow mt="md"> */}
        {links.map((element, idx) => (
          <UnstyledButton
            key={idx}
            className={`${styles.button} ${
              current === idx ? styles.activeButton : ''
            }`}
            onClick={() => setCurrent(idx)}
          >
            <Group gap="xs" className={styles.groupWrapper}>
              <div
                className={`${styles.line} ${
                  current === idx ? styles.activeLine : ''
                }`}
              ></div>
              <Group className={styles.groupWrapper}>
                {element.icon}
                <div>{element.title}</div>
              </Group>
            </Group>
          </UnstyledButton>
        ))}
        {/* </Navbar.Section> */}
      </AppShell.Navbar>
      <AppShell.Main>
        <div className={styles.pageWrapper}>
          {links[current]?.page || links[0]?.page || ''}
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default memo(LeftMenu);
