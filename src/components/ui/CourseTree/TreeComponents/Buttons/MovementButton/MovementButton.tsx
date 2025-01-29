import { ITreeUnit } from '@custom-types/data/ICourse';
import {
  ICourseAddTreeActions,
  ICourseAddTreeCheckers,
} from '@hooks/useCourseTree';
import { useLocale } from '@hooks/useLocale';
import { ActionIcon, Popover, Tooltip } from '@mantine/core';
import { FC, ReactNode, useState } from 'react';
import {
  ArrowBigDownLine,
  ArrowBigLeftLine,
  ArrowBigRightLine,
  ArrowBigUpLine,
  ArrowsMove,
} from 'tabler-icons-react';

interface IMovementButtonProps {
  currentUnit: ITreeUnit;
  actions: ICourseAddTreeActions;
  checkers: ICourseAddTreeCheckers;
}

export const MovementButton: FC<IMovementButtonProps> = ({
  currentUnit,
  actions,
  checkers,
}) => {
  const { locale } = useLocale();
  return (
    <Popover position="bottom-start" withArrow shadow="md">
      <Popover.Target>
        <Tooltip label={locale.ui.courseTree.moveElement}>
          <ActionIcon variant="transparent" size={'md'}>
            <ArrowsMove />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <>
          <ActionIcon
            size={'md'}
            onClick={() => {
              actions.moveUp({ currentUnit });
            }}
            disabled={!checkers.canMoveUp({ currentUnit })}
          >
            <ArrowBigUpLine />
          </ActionIcon>

          <ActionIcon
            size={'md'}
            onClick={() => {
              actions.moveDown({ currentUnit });
            }}
            disabled={!checkers.canMoveDown({ currentUnit })}
          >
            <ArrowBigDownLine />
          </ActionIcon>

          <ActionIcon
            size={'md'}
            onClick={() => {
              actions.moveDepthUp({ currentUnit });
            }}
            disabled={!checkers.canMoveDepthUp({ currentUnit })}
          >
            <ArrowBigLeftLine />
          </ActionIcon>

          <ActionIcon
            size={'md'}
            onClick={() => {
              actions.moveDepthDown({ currentUnit });
            }}
            disabled={!checkers.canMoveDepthDown({ currentUnit })}
          >
            <ArrowBigRightLine />
          </ActionIcon>
        </>
      </Popover.Dropdown>
    </Popover>
  );
};
