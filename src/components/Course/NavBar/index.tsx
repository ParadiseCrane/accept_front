import { IUnit } from '@custom-types/data/ICourse';
import { useCourseShowTree } from '@hooks/useCourseTree';
import { AppShell } from '@mantine/core';
import { FC, memo } from 'react';
import { NavBlock } from './NavBlock/NavBlock';

const NavBar: FC<{ units: IUnit[]; hookUnit: IUnit }> = ({
  units,
  hookUnit,
}) => {
  const course: IUnit = units[0];
  const children: IUnit[] =
    units.length > 1 ? [...units].slice(1, undefined) : [];

  const { treeUnitList, actions, checkers } = useCourseShowTree({
    course,
    children,
  });

  return (
    <AppShell.Navbar p="md">
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
    </AppShell.Navbar>
  );
};

export default memo(NavBar);
