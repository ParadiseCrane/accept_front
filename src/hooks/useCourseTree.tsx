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

const getInitialMaxDepth = ({
  treeUnitList,
}: {
  treeUnitList: ITreeUnit[];
}) => {
  let maxDepth = 0;
  for (let i = 0; i < treeUnitList.length; i++) {
    if (maxDepth < treeUnitList[i].depth) {
      maxDepth = treeUnitList[i].depth;
    }
  }
  return maxDepth;
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

const recursivelyHideChildren = () => {};

const localToggleChildrenVisibility = (
  data: ILocalMethodInput
): ITreeUnit[] => {
  const list: ITreeUnit[] = [];
  if (data.currentUnit.childrenVisible) {
    for (let i = 0; i < data.treeUnitList.length; i++) {
      if (data.treeUnitList[i].spec === data.currentUnit.spec) {
        list.push({ ...data.treeUnitList[i], childrenVisible: false });
      } else if (
        data.treeUnitList[i].order.includes(data.currentUnit.order) &&
        data.treeUnitList[i].order !== data.currentUnit.order
      ) {
        list.push({
          ...data.treeUnitList[i],
          childrenVisible: false,
          visible: false,
        });
      } else {
        list.push(data.treeUnitList[i]);
      }
    }
  } else {
    for (let i = 0; i < data.treeUnitList.length; i++) {
      if (data.treeUnitList[i].spec === data.currentUnit.spec) {
        list.push({ ...data.treeUnitList[i], childrenVisible: true });
      } else if (data.treeUnitList[i].parentSpec === data.currentUnit.spec) {
        list.push({ ...data.treeUnitList[i], visible: true });
      } else {
        list.push(data.treeUnitList[i]);
      }
    }
  }
  return list;
};

const localAddTreeUnit = (data: ILocalMethodInput): ITreeUnit[] => {
  return [];
};

const localDeleteTreeUnit = (data: ILocalMethodInput): ITreeUnit[] => {
  return [];
};

interface IUseCourseTree {
  treeUnitList: ITreeUnit[];
  toggleChildrenVisibility: ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }) => void;
  addTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  deleteTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
}

interface ILocalMethodInput {
  currentUnit: ITreeUnit;
  treeUnitList: ITreeUnit[];
}

export const useCourseTree = ({
  courseUnitList,
}: {
  courseUnitList: ICourseUnit[];
}): IUseCourseTree => {
  const [treeUnitList, setTreeUnitList] = useState<ITreeUnit[]>(
    createTreeUnitList({
      courseUnitList: courseUnitList,
    })
  );

  const toggleChildrenVisibility = ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }) => {
    if (
      treeUnitList.filter((element) =>
        element.order.includes(currentUnit.order)
      ).length > 1
    ) {
      setTreeUnitList(
        localToggleChildrenVisibility({ currentUnit, treeUnitList })
      );
    }
  };

  const addTreeUnit = ({ currentUnit }: { currentUnit: ITreeUnit }) => {
    setTreeUnitList(localAddTreeUnit({ currentUnit, treeUnitList }));
  };

  const deleteTreeUnit = ({ currentUnit }: { currentUnit: ITreeUnit }) => {
    setTreeUnitList(localDeleteTreeUnit({ currentUnit, treeUnitList }));
  };

  return {
    treeUnitList,
    toggleChildrenVisibility,
    addTreeUnit,
    deleteTreeUnit,
  };
};
