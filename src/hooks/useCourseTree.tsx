import { ICourseUnit, ITreeUnit } from '@custom-types/data/ICourse';
import { useState } from 'react';

const getParentSpec = ({
  courseUnit,
  courseUnitList,
}: {
  courseUnit: ICourseUnit;
  courseUnitList: ICourseUnit[];
}): string => {
  if (courseUnit.order.split('|').length === 1) {
    return '';
  } else {
    return courseUnitList.filter(
      (element) =>
        element.order === courseUnit.order.split('|').slice(0, -1).join('|')
    )[0].spec;
  }
};

const createTreeUnit = ({
  courseUnit,
  courseUnitList,
  index,
}: {
  courseUnit: ICourseUnit;
  courseUnitList: ICourseUnit[];
  index: number;
}): ITreeUnit => {
  return {
    ...courseUnit,
    depth: courseUnit.order.split('|').length,
    index: index,
    parentSpec: getParentSpec({
      courseUnit: courseUnit,
      courseUnitList: courseUnitList,
    }),
    visible: courseUnit.order.split('|').length === 1 ? true : false,
    childrenVisible: false,
  };
};

const createTreeUnitList = ({
  courseUnitList,
}: {
  courseUnitList: ICourseUnit[];
}): ITreeUnit[] => {
  const list: ITreeUnit[] = [];
  for (let i = 0; i < courseUnitList.length; i++) {
    list.push(
      createTreeUnit({
        courseUnit: courseUnitList[i],
        courseUnitList: courseUnitList,
        index: i,
      })
    );
  }

  return list;
};

interface IUseCourseTree {
  treeUnitList: ITreeUnit[];
  toggleChildrenVisibility: ({ spec }: { spec: string }) => void;
  addTreeUnit: ({ spec }: { spec: string }) => void;
  deleteTreeUnit: ({ spec }: { spec: string }) => void;
}

export const useCourseTree = ({
  courseUnitList,
}: {
  courseUnitList: ICourseUnit[];
}): IUseCourseTree => {
  const [treeUnitList, setTreeUnitList] = useState<ITreeUnit[]>(
    createTreeUnitList({ courseUnitList: courseUnitList })
  );
  return {
    treeUnitList: treeUnitList,
    toggleChildrenVisibility: () => {},
    addTreeUnit: () => {},
    deleteTreeUnit: () => {},
  };
};
