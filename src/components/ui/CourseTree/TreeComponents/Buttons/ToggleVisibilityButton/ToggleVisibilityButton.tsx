import { ITreeUnit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { ActionIcon, Tooltip } from '@mantine/core';
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
    const { locale } = useLocale();
    return (
      <Tooltip
        label={
          currentUnit.childrenVisible
            ? locale.ui.courseTree.hideChildren
            : locale.ui.courseTree.showChildren
        }
      >
        <ActionIcon
          variant="transparent"
          size={'sm'}
          onClick={() => {
            toggleChildrenVisibility({ currentUnit });
          }}
          style={{
            display: canToggleChildrenVisibility({ currentUnit }) ? '' : 'none',
          }}
        >
          {currentUnit.childrenVisible ? <CaretDown /> : <CaretRight />}
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <ActionIcon variant="transparent" size={'sm'} disabled>
      <CaretRight />
    </ActionIcon>
  );
};
