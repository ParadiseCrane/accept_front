import { ICourseUnit, ITreeUnit } from '@custom-types/data/ICourse';
import { ActionIcon, Box, Group, TextInput } from '@mantine/core';
import React from 'react';
import {
  ArrowBigDownLine,
  ArrowBigLeftLine,
  ArrowBigRightLine,
  ArrowBigUpLine,
  ArrowUp,
  CaretDown,
  CaretRight,
  Plus,
  Trash,
} from 'tabler-icons-react';

export const CourseUnitDisplay = ({
  treeUnit,
  canAddTreeUnit,
  addTreeUnit,
  deleteTreeUnit,
  toggleChildrenVisibility,
}: {
  treeUnit: ITreeUnit;
  canAddTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
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
        paddingLeft: `${treeUnit.depth * 15}px`,
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
            style={{
              display: canAddTreeUnit({ currentUnit: treeUnit }) ? '' : 'none',
            }}
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
            style={{
              display: canAddTreeUnit({ currentUnit: treeUnit }) ? '' : 'none',
            }}
          >
            {treeUnit.childrenVisible ? <CaretDown /> : <CaretRight />}
          </ActionIcon>

          {/* <ActionIcon variant="outline" size={'sm'} onClick={() => {}}>
            {<ArrowBigUpLine />}
          </ActionIcon>

          <ActionIcon variant="outline" size={'sm'} onClick={() => {}}>
            {<ArrowBigDownLine />}
          </ActionIcon>

          <ActionIcon variant="outline" size={'sm'} onClick={() => {}}>
            {<ArrowBigLeftLine />}
          </ActionIcon>

          <ActionIcon variant="outline" size={'sm'} onClick={() => {}}>
            {<ArrowBigRightLine />}
          </ActionIcon> */}
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
