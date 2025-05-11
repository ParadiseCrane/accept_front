import { ITreeUnit } from '@custom-types/data/ICourse';
import { ActionIcon } from '@mantine/core';
import React, { FC } from 'react';
import { CaretDown, CaretRight } from 'tabler-icons-react';

interface IToggleVisibilityButtonProps {
  currentUnit: ITreeUnit;
  id: string;
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
  id,
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
          document
            .getElementById(id)
            ?.addEventListener('click', (e) => e.preventDefault());
          e.preventDefault();
          e.stopPropagation();
          toggleChildrenVisibility({ currentUnit });
        }}
        style={{
          display: canToggleChildrenVisibility({ currentUnit }) ? '' : 'none',
        }}
        c={'dark'}
      >
        {currentUnit.childrenVisible ? <CaretDown /> : <CaretRight />}
      </ActionIcon>
    );
  }

  return (
    <ActionIcon variant="transparent" size={'sm'} disabled>
      <CaretRight />
    </ActionIcon>
  );
};
