'use client';
import { ITreeUnit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { Tip } from '@ui/basics';
import { FC } from 'react';

interface IDeleteButtonProps {
  styles: any;
  currentUnit: ITreeUnit;
  deleteTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  canDeleteTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
}

export const DeleteButton: FC<IDeleteButtonProps> = ({
  styles,
  currentUnit,
  deleteTreeUnit,
  canDeleteTreeUnit,
}) => {
  const { locale } = useLocale();
  return (
    <Tip
      label={locale.ui.courseTree.deleteElement}
      spanStyle={styles.iconWrapper}
    >
      <ActionIcon
        className={styles.delete}
        variant="transparent"
        size="sm"
        onClick={() => {
          deleteTreeUnit({ currentUnit });
        }}
        disabled={!canDeleteTreeUnit({ currentUnit })}
      >
        <IconTrash stroke={1.5} />
      </ActionIcon>
    </Tip>
  );
};
