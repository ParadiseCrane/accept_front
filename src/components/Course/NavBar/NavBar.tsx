"use client";
import { IBaseTreeUnit } from "@custom-types/data/ICourse";
import { useCourseShowTree } from "@hooks/useCourseTree";
import { useLocale } from "@hooks/useLocale";
import { AppShell } from "@mantine/core";
import { FC, memo, useEffect, useState } from "react";

import { NavBlock } from "./NavBlock/NavBlock";
import NavigationMenu from "./NavigationMenu/NavigationMenu";
import styles from "./navbar.module.css";
import { Tip } from "@ui/basics";
import { tooltipOpenDelay } from "@constants/Duration";
import { IconArrowLeft } from "@tabler/icons-react";
import { ImageComponent } from "@ui/ImageSelector/ImageComponent/ImageComponent";
import Link from "next/link";
import clsx from "clsx";

const NavBar: FC<{
  units: IBaseTreeUnit[];
  hookUnit: IBaseTreeUnit;
  image?: string;
  prev: () => void;
  next: () => void;
  select: (_: IBaseTreeUnit) => void;
  navbarOpened: boolean;
}> = ({ units, hookUnit, image, prev, next, select, navbarOpened }) => {
  const course: IBaseTreeUnit = units[0];
  const children: IBaseTreeUnit[] =
    units.length > 1 ? [...units].slice(1, undefined) : [];
  const { locale } = useLocale();
  const [prevUnit, setPrevUnit] = useState<IBaseTreeUnit | null>(null);

  const { treeUnitList, actions, checkers } = useCourseShowTree({
    course,
    children,
  });

  useEffect(() => {
    if (
      hookUnit.spec !== prevUnit?.spec &&
      treeUnitList.length > 0 &&
      hookUnit.spec !== course.spec
    ) {
      actions.openElementAndParents({ currentUnit: hookUnit });
      setPrevUnit(hookUnit);
    }
  }, [prevUnit, hookUnit, actions, treeUnitList, course]);

  return (
    <AppShell.Navbar
      className={clsx(styles.navbar, navbarOpened && styles.shadow)}
    >
      <Link href={"/course/list"}>
        <Tip
          label={locale.course.backToCoursesTip}
          openDelay={tooltipOpenDelay}
          position="top"
          spanStyle={styles.backToCoursesWrapper}
        >
          <IconArrowLeft color={"var(--primary)"} />
          <div>{locale.course.backToCoursesButton}</div>
        </Tip>
      </Link>
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
