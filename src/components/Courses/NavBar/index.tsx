import { ICourse } from '@custom-types/data/ICourse';
import { AppShell, NavLink } from '@mantine/core';
import { FC, memo } from 'react';
import NavBlock from './NavBlock';

const NavBar: FC<{ course: ICourse }> = ({ course }) => {
  return (
    <AppShell.Navbar p="md">
      <NavLink href={`#${course.spec}`} label="Introduction" />
      {course.children.map((unit, index) => (
        <NavBlock key={index} item={unit} />
      ))}
    </AppShell.Navbar>
  );
};

export default memo(NavBar);
