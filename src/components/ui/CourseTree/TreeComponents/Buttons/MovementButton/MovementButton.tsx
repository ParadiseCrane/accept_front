'use client';
import { ITreeUnit } from '@custom-types/data/ICourse';
import {
  ICourseAddTreeActions,
  ICourseAddTreeCheckers,
} from '@hooks/useCourseTree';
import { useLocale } from '@hooks/useLocale';
import { ActionIcon, Popover } from '@mantine/core';
import {
  IconArrowsMove,
  IconArrowBigDownLine,
  IconArrowBigLeftLine,
  IconArrowBigRightLine,
  IconArrowBigUpLine,
} from '@tabler/icons-react';
import { Tip } from '@ui/basics';
import { FC } from 'react';

interface IMovementButtonProps {
  currentUnit: ITreeUnit;
  actions: ICourseAddTreeActions;
  checkers: ICourseAddTreeCheckers;
  styles: any;
}

export const MovementButton: FC<IMovementButtonProps> = ({
  currentUnit,
  actions,
  checkers,
  styles,
}) => {
  const { locale } = useLocale();
  return (
    <Popover
      position="bottom-start"
      withArrow
      shadow="md"
      classNames={{ dropdown: styles.dropdown }}
    >
      <Popover.Target>
        <Tip
          label={locale.ui.courseTree.moveElement}
          spanStyle={styles.iconWrapper}
        >
          <ActionIcon variant="transparent" size={'sm'}>
            <IconArrowsMove stroke={1.5} />
          </ActionIcon>
        </Tip>
      </Popover.Target>
      <Popover.Dropdown>
        <>
          <ActionIcon
            size={'sm'}
            onClick={() => {
              actions.moveUp({ currentUnit });
            }}
            disabled={!checkers.canMoveUp({ currentUnit })}
          >
            <IconArrowBigUpLine stroke={1.5} />
          </ActionIcon>

          <ActionIcon
            size={'sm'}
            onClick={() => {
              actions.moveDown({ currentUnit });
            }}
            disabled={!checkers.canMoveDown({ currentUnit })}
          >
            <IconArrowBigDownLine stroke={1.5} />
          </ActionIcon>

          <ActionIcon
            size={'sm'}
            onClick={() => {
              actions.moveDepthUp({ currentUnit });
            }}
            disabled={!checkers.canMoveDepthUp({ currentUnit })}
          >
            <IconArrowBigLeftLine stroke={1.5} />
          </ActionIcon>

          <ActionIcon
            size={'sm'}
            onClick={() => {
              actions.moveDepthDown({ currentUnit });
            }}
            disabled={!checkers.canMoveDepthDown({ currentUnit })}
          >
            <IconArrowBigRightLine stroke={1.5} />
          </ActionIcon>
        </>
      </Popover.Dropdown>
    </Popover>
  );
};
