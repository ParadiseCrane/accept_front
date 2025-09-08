'use client';

import {
  IBaseTreeUnit,
  ICourse,
  ILesson,
  ITreeUnit,
  IUnit,
} from '@custom-types/data/ICourse';
import { useCourseContentsTree } from '@hooks/useCourseTree';
import { FC, memo } from 'react';
import { ContentsItem } from './ContentsItem';
import { useLocale } from '@hooks/useLocale';
import { Title } from '@mantine/core';

import styles from './styles.module.css';

interface Props {
  units: IBaseTreeUnit[];
  courseSpec: string;
  currentUnit: ICourse | IUnit | ILesson;
  select: (_: IBaseTreeUnit) => void;
}

const Component: FC<Props> = ({ units, currentUnit, courseSpec, select }) => {
  const { treeUnitList } = useCourseContentsTree({
    children: units,
    currentUnitSpec: currentUnit.spec,
    courseSpec,
  });
  const { locale } = useLocale();

  const MIN_DEPTH = Math.min(...treeUnitList.map((e) => e.depth));

  const isDirectChild = (element: ITreeUnit) => {
    return element.depth === MIN_DEPTH;
  };

  if (treeUnitList.length === 0) return null;

  return (
    <div className={styles.contents}>
      <Title order={1} ta={'center'}>
        {locale.course.contents(currentUnit.kind as 'unit' | 'course')}
      </Title>
      {treeUnitList.map((e) => {
        return (
          <ContentsItem
            key={e.spec}
            item={{ ...e, depth: e.depth - MIN_DEPTH }}
            select={select}
            isDirectChild={isDirectChild(e)}
          />
        );
      })}
    </div>
  );
};

export const Contents = memo(Component);
