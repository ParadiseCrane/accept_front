'use client';
import { ITreeUnit } from '@custom-types/data/ICourse';
import {
  ICourseGroupOpennessTreeActions,
  ICourseShowTreeCheckers,
} from '@hooks/useCourseTree';
import { Box, Group, TextInput } from '@mantine/core';
import styles from './styles.module.css';
import { ToggleVisibilityButton } from './ToggleVisibilityButton/ToggleVisibilityButton';
import { ToggleOpennessButton } from './ToggleOpennessButton/ToggleOpennessButton';
import { Title } from './Title/Title';

export const CourseUnitOpenness = ({
  currentUnit,
  actions,
  checkers,
  toggleOpennessTreeUnit,
}: {
  currentUnit: ITreeUnit;
  actions: ICourseGroupOpennessTreeActions;
  checkers: ICourseShowTreeCheckers;
  toggleOpennessTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
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

          <TextInput
            defaultValue={currentUnit.title}
            classNames={{ input: styles.input }}
            onMouseDown={(e) => e.preventDefault()}
          />

          <ToggleOpennessButton
            styles={undefined}
            currentUnit={currentUnit}
            toggleOpennessTreeUnit={toggleOpennessTreeUnit}
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

          <TextInput
            defaultValue={currentUnit.title}
            classNames={{ input: styles.input }}
            onMouseDown={(e) => e.preventDefault()}
          />
          {/* <Title title={currentUnit.title} /> */}
          <ToggleOpennessButton
            styles={undefined}
            currentUnit={currentUnit}
            toggleOpennessTreeUnit={toggleOpennessTreeUnit}
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
        <TextInput
          defaultValue={currentUnit.title}
          classNames={{ input: styles.input }}
          onMouseDown={(e) => e.preventDefault()}
        />
      </Group>
    </Box>
  );
};
