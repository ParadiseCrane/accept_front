'use client';
import { tooltipOpenDelay } from '@constants/Duration';
import { ITreeUnit, IBaseTreeUnit } from '@custom-types/data/ICourse';
import {
  ICourseShowTreeActions,
  ICourseShowTreeCheckers,
} from '@hooks/useCourseTree';
import { FC } from 'react';

import { ToggleVisibilityButton } from '../ToggleVisibilityButton/ToggleVisibilityButton';
import styles from './styles.module.css';
import { Tip } from '@ui/basics';

export const NavBlock: FC<{
  currentUnit: ITreeUnit;
  hookUnit: IBaseTreeUnit;
  actions: ICourseShowTreeActions;
  checkers: ICourseShowTreeCheckers;
  onClick: (_: IBaseTreeUnit) => void;
}> = ({ hookUnit, currentUnit, actions, checkers, onClick }) => {
  const active = hookUnit.spec === currentUnit.spec;

  const action = () => {
    onClick(currentUnit);
    !currentUnit.childrenVisible &&
      checkers.canToggleChildrenVisibility({ currentUnit }) &&
      actions.toggleChildrenVisibility({ currentUnit });
  };

  if (currentUnit.kind === 'course') {
    return (
      <div
        onClick={action}
        className={styles.box_wrapper}
        style={{
          paddingLeft: `${currentUnit.depth}rem`,
          backgroundColor: active ? 'var(--dark7)' : '',
        }}
      >
        <div className={styles.box}>
          <Tip
            label={currentUnit.title}
            openDelay={tooltipOpenDelay}
            position="top"
          >
            <div>{currentUnit.title}</div>
          </Tip>
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
      <div
        onClick={action}
        className={styles.box_wrapper}
        style={{
          paddingLeft: `${1.375 * currentUnit.depth}rem`,
          backgroundColor: active ? 'var(--dark7)' : '',
        }}
      >
        <div className={styles.box}>
          <Tip
            label={currentUnit.title}
            openDelay={tooltipOpenDelay}
            position="top"
          >
            <div className={styles.title}>{currentUnit.title}</div>
          </Tip>
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
    <div
      onClick={() => onClick(currentUnit)}
      className={styles.box_wrapper}
      style={{
        paddingLeft: `${1.375 * currentUnit.depth}rem`,
        backgroundColor: active ? 'var(--dark7)' : '',
      }}
    >
      <div className={styles.box}>
        <Tip
          label={currentUnit.title}
          openDelay={tooltipOpenDelay}
          position="top"
        >
          <div className={styles.title}>{currentUnit.title}</div>
        </Tip>
      </div>
    </div>
  );
};
