import { ICourse, ICourseModel, IUnit } from '@custom-types/data/ICourse';
import { AppShell, NavLink } from '@mantine/core';
import { FC, memo } from 'react';
import NavBlock from './NavBlock';

const NavBar: FC<{ units: IUnit[] }> = ({ units }) => {
  const courseUnit = units[0];
  const children: IUnit[] =
    units.length > 1 ? [...units].slice(1, undefined) : [];

  return (
    <AppShell.Navbar p="md">
      <NavLink href={`#${courseUnit.spec}`} label={courseUnit.title} />
      {children.map((unit, index) => (
        // <NavBlock unit={unit} />
        <NavLink href={`#${unit.spec}`} label={unit.title} />
      ))}
    </AppShell.Navbar>
  );
};

export default memo(NavBar);
