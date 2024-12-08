import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { Box, Group, NavLink, UnstyledButton } from '@mantine/core';
import { FC, ReactNode, memo, useEffect, useState } from 'react';
import styles from './leftMenu.module.css';
import { useRouter } from 'next/router';

const LeftMenu: FC<{
  links: IMenuLink[];
  initialStep?: number;
  topContent?: ReactNode;
}> = ({ links, topContent }) => {
  const router = useRouter();
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (initialLoad) {
      let section = router.query.section as string;
      changeParams!(section!);
      setInitialLoad(false);
    }
    if (!router.query.section) {
      changeParams!(links[0].section!);
    }
  });

  const displayPage = () => {
    if (router.query.section) {
      if (
        links.filter((element) => element.section == router.query.section)[0]
      ) {
        return links.filter(
          (element) => element.section == router.query.section
        )[0].page;
      } else {
        return links[0].page;
      }
    } else {
      return links[0].page;
    }
  };

  const changeParams = (section: string) => {
    const newPathObject = {
      pathname: router.pathname,
      query: { section: section },
    };
    router.push(newPathObject, undefined, { shallow: true });
  };

  return (
    <div className={styles.wrapper}>
      <Box p="xs" w={300}>
        {topContent && <>{topContent}</>}
        <>
          {links.map((element, idx) => (
            <NavLink
              key={idx}
              active={element.section == router.query.section}
              onClick={() => {
                changeParams!(links[idx].section!);
              }}
              label={element.title}
              leftSection={element.icon}
            />
          ))}
        </>
      </Box>
      <div className={styles.pageWrapper}>{displayPage()}</div>
    </div>
  );
};

export default memo(LeftMenu);
