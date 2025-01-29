import { ITreeUnit, IUnit } from '@custom-types/data/ICourse';
import {
  ICourseShowTreeActions,
  ICourseShowTreeCheckers,
} from '@hooks/useCourseTree';
import { Anchor, Tooltip } from '@mantine/core';
import { FC } from 'react';
import { ToggleVisibilityButton } from '../ToggleVisibilityButton/ToggleVisibilityButton';
import styles from './styles.module.css';
import { tooltipOpenDelay } from '@constants/Duration';

export const NavBlock: FC<{
  hookUnit: IUnit;
  currentUnit: ITreeUnit;
  actions: ICourseShowTreeActions;
  checkers: ICourseShowTreeCheckers;
}> = ({ hookUnit, currentUnit, actions, checkers }) => {
  const active = hookUnit.spec === currentUnit.spec;

  if (currentUnit.kind === 'course') {
    return (
      <div
        className={styles.box_wrapper}
        style={{
          paddingLeft: `${currentUnit.depth}rem`,
          backgroundColor: active ? 'var(--dark7)' : '',
        }}
      >
        <div className={styles.box}>
          <Tooltip
            label={currentUnit.title}
            openDelay={tooltipOpenDelay}
            position="bottom"
          >
            <Anchor
              href={`#${currentUnit.spec}`}
              underline="never"
              c={'dark'}
              className={styles.title}
            >
              {currentUnit.title}
            </Anchor>
          </Tooltip>
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
        className={styles.box_wrapper}
        style={{
          paddingLeft: `${1.375 * currentUnit.depth}rem`,
          backgroundColor: active ? 'var(--dark7)' : '',
        }}
      >
        <div className={styles.box}>
          <Tooltip
            label={currentUnit.title}
            openDelay={tooltipOpenDelay}
            position="top"
          >
            <Anchor
              href={`#${currentUnit.spec}`}
              underline="never"
              c={'dark'}
              className={styles.title}
            >
              {currentUnit.title}
            </Anchor>
          </Tooltip>
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
      className={styles.box_wrapper}
      style={{
        paddingLeft: `${1.375 * currentUnit.depth}rem`,
        backgroundColor: active ? 'var(--dark7)' : '',
      }}
    >
      <div className={styles.box}>
        <Tooltip
          label={currentUnit.title}
          openDelay={tooltipOpenDelay}
          position="top"
        >
          <Anchor
            href={`#${currentUnit.spec}`}
            underline="never"
            c={'dark'}
            className={styles.title}
          >
            {currentUnit.title}
          </Anchor>
        </Tooltip>
      </div>
    </div>
  );
};
