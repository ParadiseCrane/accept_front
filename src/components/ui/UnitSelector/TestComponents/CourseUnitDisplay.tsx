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
  currentUnit,
  addTreeUnit,
  deleteTreeUnit,
  toggleChildrenVisibility,
  moveUp,
  moveDown,
  moveDepthUp,
  moveDepthDown,
  canToggleChildrenVisibility,
  canAddTreeUnit,
  canMoveUp,
  canMoveDown,
  canMoveDepthUp,
  canMoveDepthDown,
}: {
  currentUnit: ITreeUnit;
  addTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  deleteTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  toggleChildrenVisibility: ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }) => void;
  moveUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  moveDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  moveDepthUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  moveDepthDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  canToggleChildrenVisibility: ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }) => boolean;
  canAddTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveDepthUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveDepthDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
}) => {
  return (
    <Box
      // ml={'md'}
      style={{
        paddingLeft: `${currentUnit.depth * 15}px`,
        display: currentUnit.visible ? '' : 'none',
      }}
    >
      <Group gap={0}>
        <TextInput value={currentUnit.title} />
        <ActionIcon.Group>
          <ActionIcon
            variant="outline"
            onClick={() => {
              addTreeUnit({ currentUnit });
            }}
            style={{
              display: canAddTreeUnit({ currentUnit }) ? '' : 'none',
            }}
          >
            <Plus />
          </ActionIcon>

          <ActionIcon
            variant="outline"
            onClick={() => {
              deleteTreeUnit({ currentUnit });
            }}
          >
            <Trash />
          </ActionIcon>

          <ActionIcon
            variant="outline"
            onClick={() => {
              toggleChildrenVisibility({ currentUnit });
            }}
            style={{
              display: canToggleChildrenVisibility({ currentUnit })
                ? ''
                : 'none',
            }}
          >
            {currentUnit.childrenVisible ? <CaretDown /> : <CaretRight />}
          </ActionIcon>

          <ActionIcon
            variant="outline"
            size={'sm'}
            onClick={() => {
              moveUp({ currentUnit });
            }}
            style={{
              display: canMoveUp({ currentUnit }) ? '' : 'none',
            }}
          >
            {<ArrowBigUpLine />}
          </ActionIcon>

          <ActionIcon
            variant="outline"
            size={'sm'}
            onClick={() => {
              moveDown({ currentUnit });
            }}
            style={{
              display: canMoveDown({ currentUnit }) ? '' : 'none',
            }}
          >
            {<ArrowBigDownLine />}
          </ActionIcon>

          <ActionIcon
            variant="outline"
            size={'sm'}
            onClick={() => {
              moveDepthUp({ currentUnit });
            }}
            style={{
              display: canMoveDepthUp({ currentUnit }) ? '' : 'none',
            }}
          >
            {<ArrowBigLeftLine />}
          </ActionIcon>

          <ActionIcon
            variant="outline"
            size={'sm'}
            onClick={() => {
              moveDepthDown({ currentUnit });
            }}
            style={{
              display: canMoveDepthDown({ currentUnit }) ? '' : 'none',
            }}
          >
            {<ArrowBigRightLine />}
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
