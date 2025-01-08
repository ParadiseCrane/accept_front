import { ICourseUnit, ITreeUnit } from '@custom-types/data/ICourse';
import { ActionIcon, Box, Group, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import {
  ArrowBigDownLine,
  ArrowBigLeftLine,
  ArrowBigRightLine,
  ArrowBigUpLine,
  ArrowsMove,
  CaretDown,
  CaretRight,
  Edit,
  Pencil,
  Plus,
  Trash,
} from 'tabler-icons-react';
import { TreePopoverMenu } from './TreePopoverMenu';
import { useDebouncedCallback } from '@mantine/hooks';

export const CourseUnitDisplay = ({
  currentUnit,
  addTreeUnit,
  changeInputValue,
  deleteTreeUnit,
  toggleChildrenVisibility,
  moveUp,
  moveDown,
  moveDepthUp,
  moveDepthDown,
  canToggleChildrenVisibility,
  canAddTreeUnit,
  canDeleteTreeUnit,
  canMoveUp,
  canMoveDown,
  canMoveDepthUp,
  canMoveDepthDown,
}: {
  currentUnit: ITreeUnit;
  changeInputValue: ({
    currentUnit,
    value,
  }: {
    currentUnit: ITreeUnit;
    value: string;
  }) => void;
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
  canDeleteTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveDepthUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveDepthDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
}) => {
  const handleValueChange = useDebouncedCallback(
    (value: string) => changeInputValue({ currentUnit: currentUnit, value }),
    500
  );
  return (
    <Box
      // ml={'md'}
      style={{
        paddingLeft: `${currentUnit.depth * 15}px`,
        display: currentUnit.visible ? '' : 'none',
      }}
    >
      <Group gap={0}>
        <TextInput
          defaultValue={currentUnit.title}
          onChange={(element) => {
            handleValueChange(element.target.value);
          }}
        />

        <ActionIcon.Group>
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

          <TreePopoverMenu
            icon={
              <ActionIcon variant="outline" size={'md'}>
                {<Pencil />}
              </ActionIcon>
            }
            children={
              <>
                <ActionIcon
                  onClick={() => {
                    addTreeUnit({ currentUnit });
                  }}
                  disabled={!canAddTreeUnit({ currentUnit })}
                >
                  <Plus />
                </ActionIcon>

                <ActionIcon
                  onClick={() => {
                    deleteTreeUnit({ currentUnit });
                  }}
                  disabled={!canDeleteTreeUnit({ currentUnit })}
                >
                  <Trash />
                </ActionIcon>
              </>
            }
          />

          <TreePopoverMenu
            icon={
              <ActionIcon variant="outline" size={'md'}>
                {<ArrowsMove />}
              </ActionIcon>
            }
            children={
              <>
                <ActionIcon
                  size={'md'}
                  onClick={() => {
                    moveUp({ currentUnit });
                  }}
                  disabled={!canMoveUp({ currentUnit })}
                >
                  {<ArrowBigUpLine />}
                </ActionIcon>

                <ActionIcon
                  size={'md'}
                  onClick={() => {
                    moveDown({ currentUnit });
                  }}
                  disabled={!canMoveDown({ currentUnit })}
                >
                  {<ArrowBigDownLine />}
                </ActionIcon>

                <ActionIcon
                  size={'md'}
                  onClick={() => {
                    moveDepthUp({ currentUnit });
                  }}
                  disabled={!canMoveDepthUp({ currentUnit })}
                >
                  {<ArrowBigLeftLine />}
                </ActionIcon>

                <ActionIcon
                  size={'md'}
                  onClick={() => {
                    moveDepthDown({ currentUnit });
                  }}
                  disabled={!canMoveDepthDown({ currentUnit })}
                >
                  {<ArrowBigRightLine />}
                </ActionIcon>
              </>
            }
          />
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
