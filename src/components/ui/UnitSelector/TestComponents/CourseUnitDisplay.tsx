import { ICourseUnit, ITreeUnit } from '@custom-types/data/ICourse';
import { ActionIcon, Box, Group, TextInput } from '@mantine/core';
import React from 'react';
import { CaretDown, CaretRight, Plus, Trash } from 'tabler-icons-react';

export const CourseUnitDisplay = ({
  treeUnit,
  addTreeUnit,
  deleteTreeUnit,
  toggleChildrenVisibility,
}: {
  treeUnit: ITreeUnit;
  addTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  deleteTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  toggleChildrenVisibility: ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }) => void;
}) => {
  return (
    <Box
      ml={'md'}
      style={{
        paddingLeft: `${treeUnit.depth * 10}px`,
        display: treeUnit.visible ? '' : 'none',
      }}
    >
      <Group gap={0}>
        <TextInput value={treeUnit.title} />
        <ActionIcon.Group>
          <ActionIcon
            variant="outline"
            onClick={() => {
              addTreeUnit({ currentUnit: treeUnit });
            }}
            style={{ display: treeUnit.kind === 'lesson' ? 'none' : '' }}
          >
            <Plus />
          </ActionIcon>

          <ActionIcon
            variant="outline"
            onClick={() => {
              deleteTreeUnit({ currentUnit: treeUnit });
            }}
          >
            <Trash />
          </ActionIcon>

          <ActionIcon
            variant="outline"
            onClick={() => {
              toggleChildrenVisibility({ currentUnit: treeUnit });
            }}
            style={{ display: treeUnit.kind === 'lesson' ? 'none' : '' }}
          >
            {treeUnit.childrenVisible ? <CaretDown /> : <CaretRight />}
          </ActionIcon>
        </ActionIcon.Group>
      </Group>
      {/* <Collapse in={opened} transitionDuration={100 * unit.units.length}>
        {unit.units.map((item, index) => (
          <UnitDisplay unit={item} key={index} />
        ))}
      </Collapse> */}
    </Box>
  );
};
