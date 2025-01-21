import { ITreeUnit } from '@custom-types/data/ICourse';
import { ActionIcon } from '@mantine/core';
import { CaretDown, CaretRight } from 'tabler-icons-react';

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

export const ToggleVisibilityButton: React.FC<IToggleVisibilityButtonProps> = ({
  currentUnit,
  canToggleChildrenVisibility,
  toggleChildrenVisibility,
}) => {
  if (canToggleChildrenVisibility({ currentUnit })) {
    return (
      <ActionIcon
        variant="transparent"
        size={'sm'}
        onClick={() => {
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
