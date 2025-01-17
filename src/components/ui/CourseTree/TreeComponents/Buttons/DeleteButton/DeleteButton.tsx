import { ITreeUnit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { ActionIcon, Tooltip } from '@mantine/core';
import { Trash } from 'tabler-icons-react';

interface IDeleteButtonProps {
  styles: any;
  currentUnit: ITreeUnit;
  deleteTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  canDeleteTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
}

export const DeleteButton: React.FC<IDeleteButtonProps> = ({
  styles,
  currentUnit,
  deleteTreeUnit,
  canDeleteTreeUnit,
}) => {
  const { locale } = useLocale();
  return (
    <Tooltip label={locale.ui.courseTree.deleteElement}>
      <ActionIcon
        className={styles.delete}
        variant="transparent"
        onClick={() => {
          deleteTreeUnit({ currentUnit });
        }}
        disabled={!canDeleteTreeUnit({ currentUnit })}
      >
        <Trash />
      </ActionIcon>
    </Tooltip>
  );
};
