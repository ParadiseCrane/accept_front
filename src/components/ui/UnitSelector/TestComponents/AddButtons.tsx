import { ITreeUnit } from '@custom-types/data/ICourse';
import { ElementType } from '@hooks/useCourseTree';
import { ActionIcon, Text, Tooltip } from '@mantine/core';
import { Box, Packages, Plus } from 'tabler-icons-react';
import styles from './styles.module.css';
import { useEffect } from 'react';

export interface AddButtonProps {
  currentUnit: ITreeUnit;
  visible: boolean;
  canAddTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
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
  canAddTreeUnit,
  canAddNewUnit,
  addTreeUnit,
}) => {
  const disabled = !canAddTreeUnit({ currentUnit });
  return (
    <div
      className={styles.add_menu}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div className={styles.add_menu_wrapper}>
        {canAddNewUnit({ currentUnit }) ? (
          <Tooltip
            label={
              disabled
                ? 'Вы не можете добавить новый модуль'
                : 'Добавить новый модуль в качестве дочернего элемента'
            }
          >
            <div
              className={styles.icon_pair}
              onClick={() => {
                addTreeUnit({ currentUnit, elementType: 'unit' });
              }}
              style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            >
              <ActionIcon size={'xs'} disabled={disabled}>
                <Plus />
              </ActionIcon>
              <Text>Модуль</Text>
            </div>
          </Tooltip>
        ) : (
          <></>
        )}
        <Tooltip
          label={
            disabled
              ? 'Вы не можете добавить новый урок'
              : 'Добавить новый урок в качестве дочернего элемента'
          }
        >
          <div
            className={styles.icon_pair}
            onClick={() => {
              addTreeUnit({ currentUnit, elementType: 'lesson' });
            }}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            <ActionIcon size={'xs'} disabled={disabled}>
              <Plus />
            </ActionIcon>
            <Text>Урок</Text>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
