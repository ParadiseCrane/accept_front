import { ITreeUnit } from '@custom-types/data/ICourse';
import {
  ICourseAddTreeActions,
  ICourseAddTreeCheckers,
} from '@hooks/useCourseTree';
import { ActionIcon, Box, Group, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import React, { useState } from 'react';
import { CaretDown, CaretRight, Trash } from 'tabler-icons-react';

import { AddButtons } from '../Buttons/AddButton/AddButton';
import { DeleteButton } from '../Buttons/DeleteButton/DeleteButton';
import { MovementButton } from '../Buttons/MovementButton/MovementButton';
import { ToggleVisibilityButton } from '../Buttons/ToggleVisibilityButton/ToggleVisibilityButton';
import styles from './styles.module.css';

export const CourseUnitDisplay = ({
  currentUnit,
  actions,
  checkers,
}: {
  currentUnit: ITreeUnit;
  actions: ICourseAddTreeActions;
  checkers: ICourseAddTreeCheckers;
}) => {
  const handleValueChange = useDebouncedCallback(
    (value: string) =>
      actions.changeTitleValue({ currentUnit: currentUnit, value }),
    1000
  );
  const [addMenuVisible, setAddMenuVisible] = useState(false);
  const delay = (time: number): Promise<any> => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  if (currentUnit.kind === 'course') {
    return (
      <Box
        mt={'xs'}
        mb={'xs'}
        style={{
          display: currentUnit.visible ? '' : 'none',
        }}
        className={styles.box}
      >
        <AddButtons
          currentUnit={currentUnit}
          visible={addMenuVisible}
          canAddNewUnit={checkers.canAddNewUnit}
          addTreeUnit={actions.addTreeUnit}
        />
        <Group gap={0}>
          <ToggleVisibilityButton
            currentUnit={currentUnit}
            canToggleChildrenVisibility={checkers.canToggleChildrenVisibility}
            toggleChildrenVisibility={actions.toggleChildrenVisibility}
          />

          <TextInput
            defaultValue={currentUnit.title}
            onChange={(element) => {
              handleValueChange(element.target.value);
            }}
            onFocus={() => setAddMenuVisible(true)}
            onBlur={() => delay(100).then(() => setAddMenuVisible(false))}
          />
        </Group>
      </Box>
    );
  }

  if (currentUnit.kind === 'unit') {
    return (
      <Box
        className={styles.box}
        mt={'xs'}
        mb={'xs'}
        style={{
          paddingLeft: `calc(1.375rem * ${currentUnit.depth})`,
        }}
      >
        <AddButtons
          currentUnit={currentUnit}
          visible={addMenuVisible}
          canAddNewUnit={checkers.canAddNewUnit}
          addTreeUnit={actions.addTreeUnit}
        />
        <Group gap={0}>
          <ToggleVisibilityButton
            currentUnit={currentUnit}
            canToggleChildrenVisibility={checkers.canToggleChildrenVisibility}
            toggleChildrenVisibility={actions.toggleChildrenVisibility}
          />

          <TextInput
            defaultValue={currentUnit.title}
            onChange={(element) => {
              handleValueChange(element.target.value);
            }}
            onFocus={() => setAddMenuVisible(true)}
            onBlur={() => delay(100).then(() => setAddMenuVisible(false))}
          />

          <ActionIcon.Group>
            <MovementButton
              currentUnit={currentUnit}
              actions={actions}
              checkers={checkers}
            />
            <DeleteButton
              styles={styles}
              currentUnit={currentUnit}
              deleteTreeUnit={actions.deleteTreeUnit}
              canDeleteTreeUnit={checkers.canDeleteTreeUnit}
            />
          </ActionIcon.Group>
        </Group>
      </Box>
    );
  }

  return (
    <Box
      mt={'xs'}
      mb={'xs'}
      style={{
        paddingLeft: `calc(1.375rem * ${currentUnit.depth})`,
      }}
      className={styles.box}
    >
      <Group gap={0}>
        <div style={{ width: '1.375rem' }} />
        <TextInput
          defaultValue={currentUnit.title}
          onChange={(element) => {
            handleValueChange(element.target.value);
          }}
        />

        <ActionIcon.Group>
          <MovementButton
            currentUnit={currentUnit}
            actions={actions}
            checkers={checkers}
          />
          <DeleteButton
            styles={styles}
            currentUnit={currentUnit}
            deleteTreeUnit={actions.deleteTreeUnit}
            canDeleteTreeUnit={checkers.canDeleteTreeUnit}
          />
        </ActionIcon.Group>
      </Group>
    </Box>
  );
};
