'use client';
import { ITreeUnit } from '@custom-types/data/ICourse';
import { ActionIcon } from '@mantine/core';
import React, { FC } from 'react';
import { IconCaretDown, IconCaretRight } from '@tabler/icons-react';

interface IToggleVisibilityButtonProps {
  currentUnit: ITreeUnit;
  canToggleChildrenVisibility: ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }) => boolean;
  toggleChildrenVisibility: ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }) => void;
}

export const ToggleVisibilityButton: FC<IToggleVisibilityButtonProps> = ({
  currentUnit,
  canToggleChildrenVisibility,
  toggleChildrenVisibility,
}) => {
  if (canToggleChildrenVisibility({ currentUnit })) {
    return (
      <ActionIcon
        variant="transparent"
        size={'sm'}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleChildrenVisibility({ currentUnit });
        }}
        style={{
          display: canToggleChildrenVisibility({ currentUnit }) ? '' : 'none',
        }}
        c={'dark'}
      >
        {currentUnit.childrenVisible ? <IconCaretDown /> : <IconCaretRight />}
      </ActionIcon>
    );
  }

  return (
    <ActionIcon variant="transparent" size={'sm'} disabled>
      <IconCaretRight />
    </ActionIcon>
  );
};
