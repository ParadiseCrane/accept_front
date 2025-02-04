import { IUnit } from '@custom-types/data/ICourse';
import { useCourseShowTree } from '@hooks/useCourseTree';
import { useLocale } from '@hooks/useLocale';
import { AppShell, Image, ScrollArea } from '@mantine/core';
import { FC, memo } from 'react';

import { NavBlock } from './NavBlock/NavBlock';
import NavigationMenu from './NavigationMenu/NavigationMenu';

const NavBar: FC<{
  units: IUnit[];
  hookUnit: IUnit;
  image: string;
  prev: () => void;
  next: () => void;
}> = ({ units, hookUnit, image, prev, next }) => {
  const course: IUnit = units[0];
  const children: IUnit[] =
    units.length > 1 ? [...units].slice(1, undefined) : [];
  const { locale } = useLocale();

  const { treeUnitList, actions, checkers } = useCourseShowTree({
    course,
    children,
  });

  return (
    <AppShell.Navbar p="md">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <div style={{ overflow: 'scroll' }}>
          <Image
            src={`/api/image/${image}`}
            radius="md"
            h={100}
            fit="cover"
            mb={20}
            alt={locale.course.courseImage}
          />
          {treeUnitList
            .filter((element) => element.visible)
            .map((unit) => (
              <NavBlock
                hookUnit={hookUnit}
                currentUnit={unit}
                actions={actions}
                checkers={checkers}
                key={unit.spec}
              />
            ))}
        </div>
        <NavigationMenu prev={prev} next={next} />
      </div>
    </AppShell.Navbar>
  );
};

export default memo(NavBar);
