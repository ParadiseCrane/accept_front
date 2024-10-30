import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { Box, Group, NavLink, UnstyledButton } from '@mantine/core';
import { FC, ReactNode, memo, useState } from 'react';
import styles from './leftMenu.module.css';

const LeftMenu: FC<{
  links: IMenuLink[];
  initialStep?: number;
  topContent?: ReactNode;
}> = ({ links, initialStep, topContent }) => {
  const [current, setCurrent] = useState(initialStep || 0);

  return (
    <div className={styles.wrapper}>
      <Box p="xs" w={300}>
        {topContent && <>{topContent}</>}
        <>
          {links.map((element, idx) => (
            <NavLink
              key={idx}
              active={idx == current}
              onClick={() => setCurrent(idx)}
              label={element.title}
              leftSection={element.icon}
            />
          ))}
        </>
      </Box>
      <div className={styles.pageWrapper}>
        {links[current]?.page || links[0]?.page || ''}
      </div>
    </div>
  );
};

export default memo(LeftMenu);
