import { ITreeUnit } from '@custom-types/data/ICourse';
import {
  ICourseShowTreeActions,
  ICourseShowTreeCheckers,
} from '@hooks/useCourseTree';
import { NavLink } from '@mantine/core';
import { FC } from 'react';

export const NavBlock: FC<{
  currentUnit: ITreeUnit;
  actions: ICourseShowTreeActions;
  checkers: ICourseShowTreeCheckers;
}> = ({ currentUnit, actions, checkers }) => {
  return <NavLink href={`#${currentUnit.spec}`} label={currentUnit.title} />;
};
