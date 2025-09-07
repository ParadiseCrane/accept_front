'use client';

import { IBaseTreeUnit } from '@custom-types/data/ICourse';
import { useCourseContentsTree } from '@hooks/useCourseTree';
import { FC, memo } from 'react';

interface Props {
  units: IBaseTreeUnit[];
  courseSpec: string;
  currentUnitSpec: string;
}

const Component: FC<Props> = ({ units, currentUnitSpec, courseSpec }) => {
  const { treeUnitList } = useCourseContentsTree({
    children: units,
    currentUnitSpec,
    courseSpec,
  });

  console.log('contents', treeUnitList);
  return (
    <div>
      {treeUnitList.map((e) => {
        return <div key={e.spec}>{e.title}</div>;
      })}
    </div>
  );
};

export const Contents = Component;
