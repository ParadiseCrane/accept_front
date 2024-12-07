import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { Box, Group, NavLink, UnstyledButton } from '@mantine/core';
import { FC, ReactNode, memo, useEffect, useState } from 'react';
import styles from './leftMenu.module.css';

const LeftMenu: FC<{
  links: IMenuLink[];
  initialStep?: number;
  topContent?: ReactNode;
  changeParams?: (section: string) => void;
  router: any;
}> = ({ links, initialStep, topContent, changeParams, router }) => {
  const [current, setCurrent] = useState(initialStep || 0);
  const [initialLoad, setInitialLoad] = useState(true);
  let section = router.query.section as string;
  useEffect(() => {
    if (initialLoad) {
      let section = router.query.section as string;
      changeParams!(section!);
      setInitialLoad(false);
    }
  });

  return (
    <div className={styles.wrapper}>
      <Box p="xs" w={300}>
        {topContent && <>{topContent}</>}
        <>
          {links.map((element, idx) => (
            <NavLink
              key={idx}
              active={idx == current}
              onClick={() => {
                setCurrent(idx);
                // changeParams!(idx);
                changeParams!(links[idx].section!);
              }}
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
