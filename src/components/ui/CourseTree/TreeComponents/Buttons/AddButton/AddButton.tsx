'use client';
import { ITreeUnit } from '@custom-types/data/ICourse';
import { ElementType } from '@hooks/useCourseTree';
import { useLocale } from '@hooks/useLocale';
import { ActionIcon, Text } from '@mantine/core';
import { FC } from 'react';
import { Plus } from 'tabler-icons-react';

import styles from './styles.module.css';
import { Tip } from '@ui/basics';

interface IAddButtonProps {
  currentUnit: ITreeUnit;
  visible: boolean;
  canAddNewUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  addTreeUnit: ({
    currentUnit,
    elementType,
  }: {
    currentUnit: ITreeUnit;
    elementType: ElementType;
  }) => void;
}

export const AddButtons: FC<IAddButtonProps> = ({
  currentUnit,
  visible,
  canAddNewUnit,
  addTreeUnit,
}) => {
  const { locale } = useLocale();
  return (
    <div
      className={styles.add_menu}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div className={styles.add_menu_wrapper}>
        {canAddNewUnit({ currentUnit }) && (
          <Tip label={locale.ui.courseTree.addUnit}>
            <div
              className={styles.icon_pair}
              onClick={() => {
                addTreeUnit({ currentUnit, elementType: 'unit' });
              }}
            >
              <ActionIcon size={'xs'}>
                <Plus />
              </ActionIcon>
              <Text size="sm">{locale.ui.courseTree.unit}</Text>
            </div>
          </Tip>
        )}
        <Tip label={locale.ui.courseTree.addLesson}>
          <div
            className={styles.icon_pair}
            onClick={() => {
              addTreeUnit({ currentUnit, elementType: 'lesson' });
            }}
          >
            <ActionIcon size={'xs'}>
              <Plus />
            </ActionIcon>
            <Text size="sm">{locale.ui.courseTree.lesson}</Text>
          </div>
        </Tip>
      </div>
    </div>
  );
};
