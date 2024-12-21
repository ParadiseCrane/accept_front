import { ICourseUnit, ITreeUnit } from '@custom-types/data/ICourse';
import { ActionIcon, Box, Group, TextInput } from '@mantine/core';
import React from 'react';
import { CaretDown, CaretRight, Plus, Trash } from 'tabler-icons-react';

export const CourseUnitDisplay = ({
  treeUnit,
}: {
  treeUnit: ITreeUnit;
  addTreeUnit: ({ spec }: { spec: string }) => void;
  deleteTreeUnit: ({ spec }: { spec: string }) => void;
  toggleChildrenVisibility: ({ spec }: { spec: string }) => void;
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
        <TextInput defaultValue={treeUnit.title} />
        <ActionIcon.Group>
          <ActionIcon variant="outline">
            <Plus />
          </ActionIcon>

          <ActionIcon variant="outline">
            <Trash />
          </ActionIcon>

          <ActionIcon variant="outline" onClick={() => {}}>
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
