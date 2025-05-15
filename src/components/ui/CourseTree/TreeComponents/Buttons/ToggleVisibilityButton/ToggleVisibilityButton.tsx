import { ITreeUnit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { ActionIcon } from '@mantine/core';
import { IconCaretDown, IconCaretRight } from '@tabler/icons-react';
import { Tip } from '@ui/basics';
import { FC } from 'react';

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
  const { locale } = useLocale();
  if (canToggleChildrenVisibility({ currentUnit })) {
    return (
      <Tip
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
          {currentUnit.childrenVisible ? (
            <IconCaretDown stroke={1.5} />
          ) : (
            <IconCaretRight stroke={1.5} />
          )}
        </ActionIcon>
      </Tip>
    );
  }

  return (
    <ActionIcon variant="transparent" size={'sm'} disabled>
      <IconCaretRight stroke={1.5} />
    </ActionIcon>
  );
};
