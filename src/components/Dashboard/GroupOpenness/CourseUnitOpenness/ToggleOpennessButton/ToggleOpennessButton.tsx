import { ITreeUnit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconLock, IconLockOpen } from '@tabler/icons-react';
import { FC } from 'react';
import { Trash } from 'tabler-icons-react';

interface IToggleOpennessButtonProps {
  styles: any;
  currentUnit: ITreeUnit;
  toggleOpennessTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  canToggleOpennessTreeUnit: boolean;
}

export const ToggleOpennessButton: FC<IToggleOpennessButtonProps> = ({
  currentUnit,
  canToggleOpennessTreeUnit,
  toggleOpennessTreeUnit,
}) => {
  const { locale } = useLocale();
  return (
    <Tooltip label={locale.ui.courseTree.deleteElement}>
      <ActionIcon
        variant="transparent"
        onClick={() => {
          toggleOpennessTreeUnit({ currentUnit });
        }}
        disabled={!canToggleOpennessTreeUnit}
      >
        {currentUnit.isOpen ? <IconLockOpen /> : <IconLock />}
      </ActionIcon>
    </Tooltip>
  );
};
