import { ICourseUnit, ITreeUnit } from '@custom-types/data/ICourse';
import { Dispatch, SetStateAction, useState } from 'react';

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

const setNewIndexValues = ({
  treeUnitList,
}: {
  treeUnitList: ITreeUnit[];
}): ITreeUnit[] => {
  const list: ITreeUnit[] = [];
  for (let i = 0; i < treeUnitList.length; i++) {
    list.push({ ...treeUnitList[i], index: i });
  }
  return list;
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
  const parent = data.currentUnit;
  const children = data.treeUnitList.filter(
    (element) =>
      element.parentSpec === parent.spec &&
      element.order.includes(parent.order) &&
      element.order !== parent.order &&
      element.depth === parent.depth + 1
  );
  if (children.length === 0) {
    const parentIndex = data.treeUnitList.indexOf(parent);
    const firstPart = data.treeUnitList.slice(0, parentIndex);
    const secondPart = data.treeUnitList.slice(
      parentIndex + 1,
      data.treeUnitList.length
    );
    // TODO запрашивать тип (kind) через контекстное меню
    const isModule = true;
    const newElement: ITreeUnit = {
      spec: `${parent.spec}${isModule ? 'newModule' : 'newLesson'}1`,
      kind: isModule ? 'unit' : 'lesson',
      title: isModule ? 'Новый модуль' : 'Новый урок',
      order: `${parent.order}|1`,
      depth: parent.depth + 1,
      index: parentIndex + 1,
      parentSpec: parent.spec,
      visible: true,
      childrenVisible: false,
    };
    return [
      ...firstPart,
      { ...parent, childrenVisible: true },
      newElement,
      ...secondPart,
    ];
  } else {
    const parentIndex = data.treeUnitList.indexOf(parent);
    const visibleChildren: ITreeUnit[] = [];
    for (let i = 0; i < children.length; i++) {
      visibleChildren.push({ ...children[i], visible: true });
    }
    const lastChildIndex = data.treeUnitList.indexOf([...children].pop()!);
    const lastChildOrder = Number([...children].pop()?.order.split('|').pop()!);
    const firstPart = data.treeUnitList.slice(0, parentIndex);
    const secondPart = data.treeUnitList.slice(
      lastChildIndex + 1,
      data.treeUnitList.length
    );
    // // TODO запрашивать тип (kind) через контекстное меню
    const isModule = true;
    const newElement: ITreeUnit = {
      spec: `${parent.spec}${isModule ? 'newModule' : 'newLesson'}${
        lastChildOrder + 1
      }`,
      kind: isModule ? 'unit' : 'lesson',
      title: isModule ? 'Новый модуль' : 'Новый урок',
      order: `${parent.order}|${lastChildOrder + 1}`,
      depth: parent.depth + 1,
      index: lastChildIndex + 1,
      parentSpec: parent.spec,
      visible: true,
      childrenVisible: false,
    };
    return setNewIndexValues({
      treeUnitList: [
        ...firstPart,
        { ...parent, childrenVisible: true },
        // ...children,
        ...visibleChildren,
        newElement,
        ...secondPart,
      ],
    });
  }
  return data.treeUnitList;
};

const localDeleteTreeUnit = (data: ILocalMethodInput): ITreeUnit[] => {
  return [];
};

const localMoveLevelUp = (data: ILocalMethodInput): ITreeUnit[] => {
  return [];
};

const localMoveLevelDown = (data: ILocalMethodInput): ITreeUnit[] => {
  return [];
};

const localMoveUp = (data: ILocalMethodInput): ITreeUnit[] => {
  return [];
};

const localMoveDown = (data: ILocalMethodInput): ITreeUnit[] => {
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
  moveLevelUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  moveLevelDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  moveUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  moveDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
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
        localToggleChildrenVisibility({
          currentUnit,
          treeUnitList,
        })
      );
    }
  };

  const addTreeUnit = ({ currentUnit }: { currentUnit: ITreeUnit }) => {
    setTreeUnitList(localAddTreeUnit({ currentUnit, treeUnitList }));
  };

  const deleteTreeUnit = ({ currentUnit }: { currentUnit: ITreeUnit }) => {
    setTreeUnitList(
      localDeleteTreeUnit({
        currentUnit,
        treeUnitList,
      })
    );
  };

  const moveLevelUp = ({ currentUnit }: { currentUnit: ITreeUnit }) => {};

  const moveLevelDown = ({ currentUnit }: { currentUnit: ITreeUnit }) => {};

  const moveUp = ({ currentUnit }: { currentUnit: ITreeUnit }) => {};

  const moveDown = ({ currentUnit }: { currentUnit: ITreeUnit }) => {};

  return {
    treeUnitList,
    toggleChildrenVisibility,
    addTreeUnit,
    deleteTreeUnit,
    moveLevelUp,
    moveLevelDown,
    moveUp,
    moveDown,
  };
};
