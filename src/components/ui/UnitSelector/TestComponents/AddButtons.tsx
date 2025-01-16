import { ITreeUnit } from '@custom-types/data/ICourse';
import { ElementType } from '@hooks/useCourseTree';
import { ActionIcon, Text, Tooltip } from '@mantine/core';
import { Box, Packages, Plus } from 'tabler-icons-react';
import styles from './styles.module.css';
import { useEffect } from 'react';

export interface AddButtonProps {
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

export const AddButtons: React.FC<AddButtonProps> = ({
  currentUnit,
  visible,
  canAddNewUnit,
  addTreeUnit,
}) => {
  return (
    <div
      className={styles.add_menu}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div className={styles.add_menu_wrapper}>
        {canAddNewUnit({ currentUnit }) ? (
          <Tooltip
            label={'Добавить новый модуль в качестве дочернего элемента'}
          >
            <div
              className={styles.icon_pair}
              onClick={() => {
                addTreeUnit({ currentUnit, elementType: 'unit' });
              }}
            >
              <ActionIcon size={'xs'}>
                <Plus />
              </ActionIcon>
              <Text>Модуль</Text>
            </div>
          </Tooltip>
        ) : (
          <></>
        )}
        <Tooltip label={'Добавить новый урок в качестве дочернего элемента'}>
          <div
            className={styles.icon_pair}
            onClick={() => {
              addTreeUnit({ currentUnit, elementType: 'lesson' });
            }}
          >
            <ActionIcon size={'xs'}>
              <Plus />
            </ActionIcon>
            <Text>Урок</Text>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
