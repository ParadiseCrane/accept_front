import { ITreeUnit } from '@custom-types/data/ICourse';
import {
  ICourseShowTreeActions,
  ICourseShowTreeCheckers,
} from '@hooks/useCourseTree';
import { ActionIcon, Anchor, Box, Group, NavLink } from '@mantine/core';
import { FC } from 'react';
import { CaretDown, CaretRight } from 'tabler-icons-react';
import { ToggleVisibilityButton } from './ToggleVisibilityButton';
import styles from './styles.module.css';
import { Icon } from '@ui/basics';

export const NavBlock: FC<{
  currentUnit: ITreeUnit;
  actions: ICourseShowTreeActions;
  checkers: ICourseShowTreeCheckers;
}> = ({ currentUnit, actions, checkers }) => {
  if (currentUnit.kind === 'course') {
    return (
      <div className={styles.box_wrapper}>
        <div className={styles.box}>
          <Anchor href={`#${currentUnit.spec}`} underline="never" c={'dark'}>
            {currentUnit.title}
          </Anchor>
          <ToggleVisibilityButton
            currentUnit={currentUnit}
            canToggleChildrenVisibility={checkers.canToggleChildrenVisibility}
            toggleChildrenVisibility={actions.toggleChildrenVisibility}
          />
        </div>
      </div>
    );
  }

  if (currentUnit.kind === 'unit') {
    return (
      <div className={styles.box_wrapper}>
        <div
          className={styles.box}
          style={{ paddingLeft: `${1.375 * currentUnit.depth}rem` }}
        >
          <Anchor href={`#${currentUnit.spec}`} underline="never" c={'dark'}>
            {currentUnit.title}
          </Anchor>
          <ToggleVisibilityButton
            currentUnit={currentUnit}
            canToggleChildrenVisibility={checkers.canToggleChildrenVisibility}
            toggleChildrenVisibility={actions.toggleChildrenVisibility}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.box_wrapper}>
      <div
        className={styles.box}
        style={{ paddingLeft: `${1.375 * currentUnit.depth}rem` }}
      >
        <Anchor href={`#${currentUnit.spec}`} underline="never" c={'dark'}>
          {currentUnit.title}
        </Anchor>
      </div>
    </div>
  );
};
