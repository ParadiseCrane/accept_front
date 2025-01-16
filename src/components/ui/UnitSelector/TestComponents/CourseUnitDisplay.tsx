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
import { AddButtons, AddButtonProps } from './AddButtons';
import { useDebouncedCallback } from '@mantine/hooks';
import { ElementType } from '@hooks/useCourseTree';
import { TreePopoverMenu } from './TreePopoverMenu';

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
  canAddNewUnit,
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
  canAddNewUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canDeleteTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveDepthUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  canMoveDepthDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
}) => {
  const handleValueChange = useDebouncedCallback(
    (value: string) => changeTitleValue({ currentUnit: currentUnit, value }),
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
          canAddNewUnit={canAddNewUnit}
          addTreeUnit={addTreeUnit}
        />
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
            <ActionIcon variant="transparent" size={'sm'} disabled>
              <CaretRight />
            </ActionIcon>
          )}
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

  if (currentUnit.kind === 'lesson') {
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
              className={styles.delete}
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
      <AddButtons
        currentUnit={currentUnit}
        visible={addMenuVisible}
        canAddNewUnit={canAddNewUnit}
        addTreeUnit={addTreeUnit}
      />
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
          <ActionIcon variant="transparent" size={'sm'} disabled>
            <CaretRight />
          </ActionIcon>
        )}

        <TextInput
          defaultValue={currentUnit.title}
          onChange={(element) => {
            handleValueChange(element.target.value);
          }}
          onFocus={() => setAddMenuVisible(true)}
          onBlur={() => delay(100).then(() => setAddMenuVisible(false))}
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
            className={styles.delete}
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
