import { ITreeUnit } from '@custom-types/data/ICourse';
import { ElementType } from '@hooks/useCourseTree';
import { ActionIcon } from '@mantine/core';
import { Box, Packages, Plus } from 'tabler-icons-react';
import styles from './styles.module.css';
import { useEffect } from 'react';

export interface AddButtonProps {
  currentUnit: ITreeUnit;
  visible: boolean;
  canAddTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
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
  addTreeUnit,
}) => {
  return (
    <div
      className={styles.add_menu}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div className={styles.add_menu_wrapper}>
        <div className={styles.icon_pair}>
          <ActionIcon
            size={'sm'}
            onClick={() => {
              addTreeUnit({ currentUnit, elementType: 'unit' });
            }}
            disabled={!canAddTreeUnit({ currentUnit })}
          >
            <Plus />
          </ActionIcon>
          <ActionIcon
            size={'sm'}
            onClick={() => {
              addTreeUnit({ currentUnit, elementType: 'unit' });
            }}
            disabled={!canAddTreeUnit({ currentUnit })}
          >
            <Packages />
          </ActionIcon>
        </div>
        <div className={styles.icon_pair}>
          <ActionIcon
            size={'sm'}
            onClick={() => {
              addTreeUnit({ currentUnit, elementType: 'unit' });
            }}
            disabled={!canAddTreeUnit({ currentUnit })}
          >
            <Plus />
          </ActionIcon>
          <ActionIcon
            size={'sm'}
            onClick={() => {
              addTreeUnit({ currentUnit, elementType: 'lesson' });
            }}
            disabled={!canAddTreeUnit({ currentUnit })}
          >
            <Box />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
};
