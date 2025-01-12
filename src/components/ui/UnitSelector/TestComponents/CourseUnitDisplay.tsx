import styles from './styles.module.css';
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
  Packages,
  Trash,
  Box as BoxIcon,
} from 'tabler-icons-react';
import { TreePopoverMenu } from './AddButtons';
import { useDebouncedCallback } from '@mantine/hooks';
import { ElementType } from '@hooks/useCourseTree';

export const CourseUnitDisplay = ({
  currentUnit,
  addTreeUnit,
  changeTitleValue,
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
  changeTitleValue: ({
    currentUnit,
    value,
  }: {
    currentUnit: ITreeUnit;
    value: string;
  }) => void;
  addTreeUnit: ({
    currentUnit,
    elementType,
  }: {
    currentUnit: ITreeUnit;
    elementType: ElementType;
  }) => void;
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
    (value: string) => changeTitleValue({ currentUnit: currentUnit, value }),
    500
  );
  const [addMenuVisible, setAddMenuVisible] = useState(false);

  if (currentUnit.kind === 'course') {
    return (
      <Box
        mt={'xs'}
        mb={'xs'}
        style={{
          display: currentUnit.visible ? '' : 'none',
        }}
      >
        <Group gap={0}>
          {canToggleChildrenVisibility({ currentUnit }) ? (
            <ActionIcon
              variant="transparent"
              size={'sm'}
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
          ) : (
            <div style={{ width: '1.375rem' }} />
          )}
          <TextInput
            defaultValue={currentUnit.title}
            onChange={(element) => {
              handleValueChange(element.target.value);
            }}
          />

          <ActionIcon.Group
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <ActionIcon
              variant="transparent"
              onClick={() => {
                addTreeUnit({ currentUnit, elementType: 'unit' });
              }}
              disabled={!canAddTreeUnit({ currentUnit })}
            >
              <Packages />
            </ActionIcon>

            <ActionIcon
              variant="transparent"
              size={'sm'}
              onClick={() => {
                addTreeUnit({ currentUnit, elementType: 'lesson' });
              }}
              disabled={!canAddTreeUnit({ currentUnit })}
              style={{ display: 'flex' }}
            >
              <BoxIcon />
            </ActionIcon>
          </ActionIcon.Group>
        </Group>
      </Box>
    );
  }

  if (currentUnit.kind === 'lesson') {
    return (
      <Box
        mt={'xs'}
        mb={'xs'}
        style={{
          paddingLeft: `calc(1.375rem * ${currentUnit.depth})`,
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
            <TreePopoverMenu
              icon={
                <ActionIcon variant="transparent" size={'md'}>
                  <ArrowsMove />
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
                    <ArrowBigUpLine />
                  </ActionIcon>

                  <ActionIcon
                    size={'md'}
                    onClick={() => {
                      moveDown({ currentUnit });
                    }}
                    disabled={!canMoveDown({ currentUnit })}
                  >
                    <ArrowBigDownLine />
                  </ActionIcon>

                  <ActionIcon
                    size={'md'}
                    onClick={() => {
                      moveDepthUp({ currentUnit });
                    }}
                    disabled={!canMoveDepthUp({ currentUnit })}
                  >
                    <ArrowBigLeftLine />
                  </ActionIcon>

                  <ActionIcon
                    size={'md'}
                    onClick={() => {
                      moveDepthDown({ currentUnit });
                    }}
                    disabled={!canMoveDepthDown({ currentUnit })}
                  >
                    <ArrowBigRightLine />
                  </ActionIcon>
                </>
              }
            />
            <ActionIcon
              className={styles.visibility}
              variant="transparent"
              onClick={() => {
                deleteTreeUnit({ currentUnit });
              }}
              disabled={!canDeleteTreeUnit({ currentUnit })}
            >
              <Trash />
            </ActionIcon>
          </ActionIcon.Group>
        </Group>
      </Box>
    );
  }

  return (
    <Box
      className={styles.box}
      mt={'xs'}
      mb={'xs'}
      style={{
        paddingLeft: `calc(1.375rem * ${currentUnit.depth})`,
      }}
    >
      <div
        className={styles.add_menu}
        style={{ display: addMenuVisible ? 'block' : 'none' }}
      >
        <ActionIcon
          onClick={() => {
            addTreeUnit({ currentUnit, elementType: 'unit' });
          }}
          disabled={!canAddTreeUnit({ currentUnit })}
        >
          <Packages />
        </ActionIcon>
        <ActionIcon
          size={'sm'}
          onClick={() => {
            addTreeUnit({ currentUnit, elementType: 'lesson' });
          }}
          disabled={!canAddTreeUnit({ currentUnit })}
        >
          <BoxIcon />
        </ActionIcon>
      </div>
      <Group gap={0}>
        {canToggleChildrenVisibility({ currentUnit }) ? (
          <ActionIcon
            variant="transparent"
            size={'sm'}
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
        ) : (
          <div style={{ width: '1.375rem' }} />
        )}

        <TextInput
          defaultValue={currentUnit.title}
          onChange={(element) => {
            handleValueChange(element.target.value);
          }}
          onFocus={() => setAddMenuVisible(true)}
          onBlur={() => setAddMenuVisible(false)}
        />

        <ActionIcon.Group>
          <TreePopoverMenu
            icon={
              <ActionIcon variant="transparent" size={'md'}>
                <ArrowsMove />
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
                  <ArrowBigUpLine />
                </ActionIcon>

                <ActionIcon
                  size={'md'}
                  onClick={() => {
                    moveDown({ currentUnit });
                  }}
                  disabled={!canMoveDown({ currentUnit })}
                >
                  <ArrowBigDownLine />
                </ActionIcon>

                <ActionIcon
                  size={'md'}
                  onClick={() => {
                    moveDepthUp({ currentUnit });
                  }}
                  disabled={!canMoveDepthUp({ currentUnit })}
                >
                  <ArrowBigLeftLine />
                </ActionIcon>

                <ActionIcon
                  size={'md'}
                  onClick={() => {
                    moveDepthDown({ currentUnit });
                  }}
                  disabled={!canMoveDepthDown({ currentUnit })}
                >
                  <ArrowBigRightLine />
                </ActionIcon>
              </>
            }
          />

          <ActionIcon
            className={styles.visibility}
            variant="transparent"
            onClick={() => {
              deleteTreeUnit({ currentUnit });
            }}
            disabled={!canDeleteTreeUnit({ currentUnit })}
          >
            <Trash />
          </ActionIcon>
        </ActionIcon.Group>
      </Group>
    </Box>
  );
};
