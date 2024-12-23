import { ICourseUnit, ITreeUnit } from '@custom-types/data/ICourse';
import { date } from '@locale/en/date';
import { Dispatch, SetStateAction, useState } from 'react';

// максимальное количество уровней вложенности
const maxDepth: number = 4;

// высчитываем значение поля
const getOrderAsNumber = ({ order }: { order: string }): number => {
  let orderAsNumber = 0;
  let orderAsList = order.split('|');
  const numOfIterations =
    orderAsList.length >= maxDepth ? maxDepth : orderAsList.length;
  for (let i = 0; i < numOfIterations; i++) {
    orderAsNumber =
      orderAsNumber + Number(orderAsList[i]) * Math.pow(1000, maxDepth - i - 1);
  }
  return orderAsNumber;
};

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
    orderAsNumber: getOrderAsNumber({ order: courseUnit.order }),
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

// находим дочерние элементы всех уровней
const findChildrenAllLevels = ({
  parent,
  treeUnitList,
}: {
  parent: ITreeUnit;
  treeUnitList: ITreeUnit[];
}): ITreeUnit[] => {
  return treeUnitList.filter(
    (element) =>
      element.order.startsWith(parent.order) && element.order !== parent.order
  );
};

// находим прямых потомков
const findChildrenDirect = ({
  parent,
  treeUnitList,
}: {
  parent: ITreeUnit;
  treeUnitList: ITreeUnit[];
}): ITreeUnit[] => {
  return treeUnitList.filter((element) => element.parentSpec === parent.spec);
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
      orderAsNumber: getOrderAsNumber({
        order: `${parent.order}|${lastChildOrderLastDigit + 1}`,
      }),
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
      ].sort((a, b) => a.orderAsNumber - b.orderAsNumber),
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
      orderAsNumber: getOrderAsNumber({ order: `${parent.order}|1` }),
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
      ].sort((a, b) => a.orderAsNumber - b.orderAsNumber),
    });
  }
};

const localDeleteTreeUnit = (data: ILocalMethodInput): ITreeUnit[] => {
  return setNewIndexValues({
    treeUnitList: data.treeUnitList.filter(
      (element) => !element.order.startsWith(data.currentUnit.order)
    ),
  });
};

// сделать дочерним элементом родителя родителя
const localMoveDepthUp = (data: ILocalMethodInput): ITreeUnit[] => {
  return [];
};

// можно только на один уровень ниже, чем элемент над ним
const localMoveDepthDown = (data: ILocalMethodInput): ITreeUnit[] => {
  return [];
};

const localMoveUp = (data: ILocalMethodInput): ITreeUnit[] => {
  // если у элемента order заканчивается на 1 и мы нажимаем вверх
  // то родитель меняется
  const parentChanges = Number(data.currentUnit.order.split('|').pop()!) === 1;
  // находим родительский элемент нажатого элемента
  const parent = data.treeUnitList.filter(
    (element) => element.spec === data.currentUnit.parentSpec
  )[0];
  if (parentChanges) {
  }
  // случай, когда не меняем parent (не является крайним элементом среди дочерних)
  else {
  }

  // находим все дочерние элементы родителя (все уровни)
  const allElementsInsideParent = data.treeUnitList.filter(
    (element) =>
      element.order.startsWith(parent.order) && element.order !== parent.order
  );
  // случай, когда меняем parent (является крайним элементом среди дочерних)
  return [];
};

const localMoveDown = (data: ILocalMethodInput): ITreeUnit[] => {
  // если у элемента order заканчивается на число как у последнего элемента
  // и мы нажимаем вверх, то родитель меняется
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
  canAddTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => boolean;
  addTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  deleteTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  moveUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  moveDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  moveDepthUp: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  moveDepthDown: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
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

  const canAddTreeUnit = ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }): boolean => {
    if (
      currentUnit.kind === 'lesson' ||
      currentUnit.order.split('|').length === maxDepth
    ) {
      return false;
    }
    return true;
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

  const moveDepthUp = ({ currentUnit }: { currentUnit: ITreeUnit }) => {};

  const moveDepthDown = ({ currentUnit }: { currentUnit: ITreeUnit }) => {};

  const moveUp = ({ currentUnit }: { currentUnit: ITreeUnit }) => {};

  const moveDown = ({ currentUnit }: { currentUnit: ITreeUnit }) => {};

  return {
    treeUnitList,
    toggleChildrenVisibility,
    canAddTreeUnit,
    addTreeUnit,
    deleteTreeUnit,
    moveUp,
    moveDown,
    moveDepthUp,
    moveDepthDown,
  };
};
