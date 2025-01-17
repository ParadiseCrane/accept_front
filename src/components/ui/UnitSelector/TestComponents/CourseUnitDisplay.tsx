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
import { AddButtons, IAddButtonProps } from './AddButtons';
import { useDebouncedCallback } from '@mantine/hooks';
import {
  ElementType,
  ICourseTreeActions,
  ICourseTreeCheckers,
} from '@hooks/useCourseTree';
import { TreePopoverMenu } from './TreePopoverMenu';

export const CourseUnitDisplay = ({
  currentUnit,
  actions,
  checkers,
}: {
  currentUnit: ITreeUnit;
  actions: ICourseTreeActions;
  checkers: ICourseTreeCheckers;
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
          {checkers.canToggleChildrenVisibility({ currentUnit }) ? (
            <ActionIcon
              variant="transparent"
              size={'sm'}
              onClick={() => {
                actions.toggleChildrenVisibility({ currentUnit });
              }}
              style={{
                display: checkers.canToggleChildrenVisibility({ currentUnit })
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
                      actions.moveUp({ currentUnit });
                    }}
                    disabled={!checkers.canMoveUp({ currentUnit })}
                  >
                    <ArrowBigUpLine />
                  </ActionIcon>

                  <ActionIcon
                    size={'md'}
                    onClick={() => {
                      actions.moveDown({ currentUnit });
                    }}
                    disabled={!checkers.canMoveDown({ currentUnit })}
                  >
                    <ArrowBigDownLine />
                  </ActionIcon>

                  <ActionIcon
                    size={'md'}
                    onClick={() => {
                      actions.moveDepthUp({ currentUnit });
                    }}
                    disabled={!checkers.canMoveDepthUp({ currentUnit })}
                  >
                    <ArrowBigLeftLine />
                  </ActionIcon>

                  <ActionIcon
                    size={'md'}
                    onClick={() => {
                      actions.moveDepthDown({ currentUnit });
                    }}
                    disabled={!checkers.canMoveDepthDown({ currentUnit })}
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
                actions.deleteTreeUnit({ currentUnit });
              }}
              disabled={!checkers.canDeleteTreeUnit({ currentUnit })}
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
        canAddNewUnit={checkers.canAddNewUnit}
        addTreeUnit={actions.addTreeUnit}
      />
      <Group gap={0}>
        {checkers.canToggleChildrenVisibility({ currentUnit }) ? (
          <ActionIcon
            variant="transparent"
            size={'sm'}
            onClick={() => {
              actions.toggleChildrenVisibility({ currentUnit });
            }}
            style={{
              display: checkers.canToggleChildrenVisibility({ currentUnit })
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
                    actions.moveUp({ currentUnit });
                  }}
                  disabled={!checkers.canMoveUp({ currentUnit })}
                >
                  <ArrowBigUpLine />
                </ActionIcon>

                <ActionIcon
                  size={'md'}
                  onClick={() => {
                    actions.moveDown({ currentUnit });
                  }}
                  disabled={!checkers.canMoveDown({ currentUnit })}
                >
                  <ArrowBigDownLine />
                </ActionIcon>

                <ActionIcon
                  size={'md'}
                  onClick={() => {
                    actions.moveDepthUp({ currentUnit });
                  }}
                  disabled={!checkers.canMoveDepthUp({ currentUnit })}
                >
                  <ArrowBigLeftLine />
                </ActionIcon>

                <ActionIcon
                  size={'md'}
                  onClick={() => {
                    actions.moveDepthDown({ currentUnit });
                  }}
                  disabled={!checkers.canMoveDepthDown({ currentUnit })}
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
              actions.deleteTreeUnit({ currentUnit });
            }}
            disabled={!checkers.canDeleteTreeUnit({ currentUnit })}
          >
            <Trash />
          </ActionIcon>
        </ActionIcon.Group>
      </Group>
    </Box>
  );
};
