import { ICourseUnit, ITreeUnit } from '@custom-types/data/ICourse';
import { Dispatch, SetStateAction, useState } from 'react';

// получаем значение для поля parentSpec
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

// создаем объект типа ITreeUnit из ICourseUnit
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

// после удаления / добавления элементов переназначаем индексы
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

// создаем массив типа ITreeUnit
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

// метод по изменению видимости дочерних элементов
const localToggleChildrenVisibility = (
  data: ILocalMethodInput
): ITreeUnit[] => {
  const list: ITreeUnit[] = [];
  // если сейчас дочерние элементы видны, то скрываем
  if (data.currentUnit.childrenVisible) {
    for (let i = 0; i < data.treeUnitList.length; i++) {
      if (data.treeUnitList[i].spec === data.currentUnit.spec) {
        // меняем значение childrenVisible для родительского элемента
        // (на который нажали)
        list.push({ ...data.treeUnitList[i], childrenVisible: false });
      } else if (
        data.treeUnitList[i].order.startsWith(data.currentUnit.order) &&
        data.treeUnitList[i].order !== data.currentUnit.order
      ) {
        // меняем значение видимости для дочерних элементов
        // для всех ниже родительского через значение order
        list.push({
          ...data.treeUnitList[i],
          childrenVisible: false,
          visible: false,
        });
      } else {
        // иначе оставляем элемент без изменений
        list.push(data.treeUnitList[i]);
      }
    }
  }
  // если были скрыты, показываем
  else {
    for (let i = 0; i < data.treeUnitList.length; i++) {
      if (data.treeUnitList[i].spec === data.currentUnit.spec) {
        // для родителя меняем значение childrenVisible
        list.push({ ...data.treeUnitList[i], childrenVisible: true });
      } else if (data.treeUnitList[i].parentSpec === data.currentUnit.spec) {
        // для дочерних меняем значение видимости
        list.push({ ...data.treeUnitList[i], visible: true });
      } else {
        // иначе без изменений
        list.push(data.treeUnitList[i]);
      }
    }
  }
  return list;
};

// метод по добавлению нового элемента в дерево
const localAddTreeUnit = (data: ILocalMethodInput): ITreeUnit[] => {
  // TODO запрашивать тип (kind) через контекстное меню
  const isModule = true;
  const parent = data.currentUnit;
  const children = data.treeUnitList.filter(
    (element) => element.parentSpec === parent.spec
  );
  // находим индекс последнего дочернего элемента
  const lastChildIndex = data.treeUnitList
    .filter(
      (element) =>
        element.order.startsWith(data.currentUnit.order) &&
        element.order !== data.currentUnit.order
    )
    .pop()?.index;
  // дочерние есть
  if (lastChildIndex) {
    // находим последнее число в поле order для последнего дочернего элемента
    const lastChildOrderLastDigit = Number(
      [...children].pop()!.order.split('|').pop()!
    );
    // элементы до родителя
    const firstPart = data.treeUnitList.slice(0, parent.index);
    // между родителем и новым элементом
    const middlePart = data.treeUnitList.slice(
      parent.index + 1,
      lastChildIndex + 1
    );
    // после нового элемента
    const secondPart = data.treeUnitList.slice(
      lastChildIndex + 1,
      data.treeUnitList.length
    );
    // если у родителя не видны дочерние элементы
    if (!parent.childrenVisible) {
      for (let i = 0; i < middlePart.length; i++) {
        if (middlePart[i].parentSpec === parent.spec) {
          // включаем видимость у прямых потомков
          middlePart[i] = { ...middlePart[i], visible: true };
        }
      }
    }
    // новый элемент
    const newElement: ITreeUnit = {
      spec: `${parent.spec}${isModule ? 'newModule' : 'newLesson'}${
        lastChildOrderLastDigit + 1
      }`,
      kind: isModule ? 'unit' : 'lesson',
      title: `${parent.spec}${isModule ? 'newModule' : 'newLesson'}${
        lastChildOrderLastDigit + 1
      }`,
      order: `${parent.order}|${lastChildOrderLastDigit + 1}`,
      depth: parent.depth + 1,
      index: 0,
      parentSpec: parent.spec,
      visible: true,
      childrenVisible: false,
    };
    // до родителя
    // родитель с включенной видимостью дочерних элементов
    // дочерние элементы с включенной видимостью
    // новый элемент
    // оставшаяся часть
    return setNewIndexValues({
      treeUnitList: [
        ...firstPart,
        { ...parent, childrenVisible: true },
        ...middlePart,
        newElement,
        ...secondPart,
      ],
    });
  }
  // дочерних нет
  else {
    // от начала и до родителя
    const firstPart = data.treeUnitList.slice(0, parent.index);
    // от нового элемента и до конца массива
    const secondPart = data.treeUnitList.slice(
      parent.index + 1,
      data.treeUnitList.length
    );
    // новый элемент
    const newElement: ITreeUnit = {
      spec: `${parent.spec}${isModule ? 'newModule' : 'newLesson'}1`,
      kind: isModule ? 'unit' : 'lesson',
      title: `${parent.spec}${isModule ? 'newModule' : 'newLesson'}1`,
      order: `${parent.order}|1`,
      depth: parent.depth + 1,
      index: 0,
      parentSpec: parent.spec,
      visible: true,
      childrenVisible: false,
    };
    return setNewIndexValues({
      treeUnitList: [
        ...firstPart,
        { ...parent, childrenVisible: true },
        newElement,
        ...secondPart,
      ],
    });
  }
};

const localDeleteTreeUnit = (data: ILocalMethodInput): ITreeUnit[] => {
  const list: ITreeUnit[] = [];

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

// интерфейс хука
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

// интерфейс входных данных для локальных методов
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
    // если есть дочерние элементы
    if (
      treeUnitList.filter((element) => element.parentSpec === currentUnit.spec)
        .length > 0
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
