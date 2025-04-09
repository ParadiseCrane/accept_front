import { ITreeUnit } from '@custom-types/data/ICourse';
import {
  ICourseShowTreeActions,
  ICourseShowTreeCheckers,
} from '@hooks/useCourseTree';
import { ActionIcon, Box, Group, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import React, { useState } from 'react';

import styles from './styles.module.css';
import { ToggleVisibilityButton } from './ToggleVisibilityButton/ToggleVisibilityButton';
import { ToggleOpennessButton } from './ToggleOpennessButton/ToggleOpennessButton';

export const CourseUnitOpenness = ({
  currentUnit,
  actions,
  checkers,
  toggleGroupOpennessList,
}: {
  currentUnit: ITreeUnit;
  actions: ICourseShowTreeActions;
  checkers: ICourseShowTreeCheckers;
  toggleGroupOpennessList: () => Promise<void>;
}) => {
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
        <Group gap={0}>
          <ToggleVisibilityButton
            currentUnit={currentUnit}
            canToggleChildrenVisibility={checkers.canToggleChildrenVisibility}
            toggleChildrenVisibility={actions.toggleChildrenVisibility}
          />

          <TextInput value={currentUnit.title} contentEditable={false} />

          <ToggleOpennessButton
            styles={undefined}
            currentUnit={currentUnit}
            toggleOpennessTreeUnit={toggleGroupOpennessList}
            canToggleOpennessTreeUnit={true}
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
        <Group gap={0}>
          <ToggleVisibilityButton
            currentUnit={currentUnit}
            canToggleChildrenVisibility={checkers.canToggleChildrenVisibility}
            toggleChildrenVisibility={actions.toggleChildrenVisibility}
          />

          <TextInput value={currentUnit.title} />
          <ToggleOpennessButton
            styles={undefined}
            currentUnit={currentUnit}
            toggleOpennessTreeUnit={toggleGroupOpennessList}
            canToggleOpennessTreeUnit={true}
          />
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
        <TextInput value={currentUnit.title} />
      </Group>
    </Box>
  );
};
