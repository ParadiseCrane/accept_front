import { tooltipOpenDelay } from '@constants/Duration';
import { ITreeUnit, IUnit } from '@custom-types/data/ICourse';
import {
  ICourseShowTreeActions,
  ICourseShowTreeCheckers,
} from '@hooks/useCourseTree';
import { Anchor } from '@mantine/core';
import { FC } from 'react';

import { ToggleVisibilityButton } from '../ToggleVisibilityButton/ToggleVisibilityButton';
import styles from './styles.module.css';
import { Tip } from '@ui/basics';
import { v4 } from 'uuid';

export const NavBlock: FC<{
  hookUnit: IUnit;
  currentUnit: ITreeUnit;
  actions: ICourseShowTreeActions;
  checkers: ICourseShowTreeCheckers;
}> = ({ hookUnit, currentUnit, actions, checkers }) => {
  const active = hookUnit.spec === currentUnit.spec;
  const id = v4();

  if (currentUnit.kind === 'course') {
    return (
      <Anchor
        href={`#${currentUnit.spec}`}
        onClick={() => {
          !currentUnit.childrenVisible &&
            checkers.canToggleChildrenVisibility({ currentUnit }) &&
            actions.toggleChildrenVisibility({ currentUnit });
        }}
        underline="never"
        c="dark"
        id={id}
      >
        <div
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
              <div className={styles.title}>{currentUnit.title}</div>
            </Tip>
            <ToggleVisibilityButton
              id={id}
              currentUnit={currentUnit}
              canToggleChildrenVisibility={checkers.canToggleChildrenVisibility}
              toggleChildrenVisibility={actions.toggleChildrenVisibility}
            />
          </div>
        </div>
      </Anchor>
    );
  }

  if (currentUnit.kind === 'unit') {
    return (
      <Anchor
        href={`#${currentUnit.spec}`}
        onClick={() =>
          !currentUnit.childrenVisible &&
          checkers.canToggleChildrenVisibility({ currentUnit }) &&
          actions.toggleChildrenVisibility({ currentUnit })
        }
        underline="never"
        c="dark"
      >
        <div
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
              id={id}
              currentUnit={currentUnit}
              canToggleChildrenVisibility={checkers.canToggleChildrenVisibility}
              toggleChildrenVisibility={actions.toggleChildrenVisibility}
            />
          </div>
        </div>
      </Anchor>
    );
  }

  return (
    <Anchor href={`#${currentUnit.spec}`} underline="never" c="dark">
      <div
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
    </Anchor>
  );
};
