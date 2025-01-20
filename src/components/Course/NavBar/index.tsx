import { ICourse, ICourseModel, IUnit } from '@custom-types/data/ICourse';
import { useCourseAddTree, useCourseShowTree } from '@hooks/useCourseTree';
import { AppShell, NavLink } from '@mantine/core';
import { FC, memo } from 'react';
import { NavBlock } from './NavBlock';

const NavBar: FC<{ units: IUnit[] }> = ({ units }) => {
  const course: IUnit = units[0];
  const children: IUnit[] =
    units.length > 1 ? [...units].slice(1, undefined) : [];
  // const { treeUnitList, actions, checkers } = useCourseAddTree({
  //   courseUnitList: units,
  //   form,
  //   newUnitTitleLocale: {
  //     lesson: locale.ui.courseTree.newLesson,
  //     unit: locale.ui.courseTree.newUnit,
  //   },
  // });

  const { treeUnitList, actions, checkers } = useCourseShowTree({
    course,
    children,
  });

  return (
    <AppShell.Navbar p="md">
      {/* <NavLink href={`#${course.spec}`} label={course.title} />
      {children.map((unit, index) => (
        <NavLink href={`#${unit.spec}`} label={unit.title} />
      ))} */}
      {treeUnitList
        .filter((element) => element.visible)
        .map((unit) => (
          <NavBlock
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
