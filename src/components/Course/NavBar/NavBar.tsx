'use client';
import { IBaseTreeUnit } from '@custom-types/data/ICourse';
import { useCourseShowTree } from '@hooks/useCourseTree';
import { useLocale } from '@hooks/useLocale';
import { AppShell, Image, ScrollArea } from '@mantine/core';
import { FC, memo } from 'react';

import { NavBlock } from './NavBlock/NavBlock';
import NavigationMenu from './NavigationMenu/NavigationMenu';
import styles from './navbar.module.css';
import { Tip } from '@ui/basics';
import { tooltipOpenDelay } from '@constants/Duration';
import { IconArrowLeft } from '@tabler/icons-react';
import { ImageComponent } from '@ui/ImageSelector/ImageComponent/ImageComponent';

const NavBar: FC<{
  units: IBaseTreeUnit[];
  hookUnit: IBaseTreeUnit;
  image?: string;
  prev: () => void;
  next: () => void;
  select: (_: IBaseTreeUnit) => void;
}> = ({ units, hookUnit, image, prev, next, select }) => {
  const course: IBaseTreeUnit = units[0];
  const children: IBaseTreeUnit[] =
    units.length > 1 ? [...units].slice(1, undefined) : [];
  const { locale } = useLocale();

  const { treeUnitList, actions, checkers } = useCourseShowTree({
    course,
    children,
  });

  return (
    <AppShell.Navbar className={styles.navbar}>
      <Tip
        label={locale.course.backToCoursesTip}
        openDelay={tooltipOpenDelay}
        position="top"
        spanStyle={styles.backToCoursesWrapper}
      >
        <IconArrowLeft color={'var(--primary)'} />
        <a href="/courses">{locale.course.backToCoursesButton}</a>
      </Tip>
      <div className={styles.navbarWrapper}>
        <div className={styles.imageWithUnits}>
          <div className={styles.imageWrapper}>
            <ImageComponent
              index={0}
              item={image}
              active={false}
              animate
              height={100}
              radius="md"
              cover
            />
          </div>
          {treeUnitList
            .filter((element) => element.visible)
            .map((unit) => (
              <NavBlock
                hookUnit={hookUnit}
                currentUnit={unit}
                actions={actions}
                checkers={checkers}
                onClick={select}
                key={unit.spec}
              />
            ))}
        </div>
        <div className={styles.navMenu}>
          <NavigationMenu prev={prev} next={next} />
        </div>
      </div>
    </AppShell.Navbar>
  );
};

export default memo(NavBar);
