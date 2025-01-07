import { ICourseUnit, ITreeUnit } from '@custom-types/data/ICourse';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type UpOrDown = 'UP' | 'DOWN';

// максимальное количество уровней вложенности
const maxDepth: number = 4;

const getMaxDepthFromList = ({
  listToCheck,
}: {
  listToCheck: ITreeUnit[];
}): number => {
  let depth: number = 0;
  for (let i = 0; i < listToCheck.length; i++) {
    if (listToCheck[i].depth > depth) {
      depth = listToCheck[i].depth;
    }
  }
  return depth;
};

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
  if (courseUnit.kind === 'course') {
    return 'none';
  }
  if (courseUnit.order.split('|').length === 1) {
    return [...courseUnitList][0].spec;
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
    depth: courseUnit.order === '0' ? 0 : courseUnit.order.split('|').length,
    index: index,
    parentSpec: getParentSpec({
      courseUnit: courseUnit,
      courseUnitList: courseUnitList,
    }),
    visible: courseUnit.order.split('|').length === 1 ? true : false,
    childrenVisible: courseUnit.order === '0' ? true : false,
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
  if (parent.depth === 0) {
    return treeUnitList.slice(1, undefined);
  } else {
    return treeUnitList.filter(
      (element) =>
        element.order.startsWith(parent.order) && element.order !== parent.order
    );
  }
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

// все элементы до родителя
const beforeParentPart = ({
  parent,
  treeUnitList,
}: {
  parent: ITreeUnit;
  treeUnitList: ITreeUnit[];
}): ITreeUnit[] => {
  return treeUnitList.slice(0, parent.index);
};

// от последнего дочернего элемента и до конца
const afterLastChildPart = ({
  treeUnitList,
  lastChildIndex,
}: {
  treeUnitList: ITreeUnit[];
  lastChildIndex: number;
}) => {
  return treeUnitList.slice(lastChildIndex + 1);
};

// нахождение элемента на одном уровне с текущим
// если мы не найдем такой элемент, вернем текущий (который передали)
const findElementSibling = ({
  currentElement,
  treeUnitList,
  upOrDown,
}: {
  currentElement: ITreeUnit;
  treeUnitList: ITreeUnit[];
  upOrDown: UpOrDown;
}): ITreeUnit => {
  const parent = treeUnitList.filter(
    (element) => element.spec === currentElement.parentSpec
  )[0];
  const directChildren = findChildrenDirect({ parent, treeUnitList });
  // если у родителя только один потомок (текущий элемент)
  // то возвращаем текущий элемент
  if (directChildren.length === 1) {
    return currentElement;
  }
  // проверяем, есть ли родственник одного уровня выше текущего элемента
  if (upOrDown === 'UP') {
    // если индекс родственника меньше индекса текущего элемента
    // значит, элемент выше существует
    if (directChildren[0].index < currentElement.index) {
      return directChildren[directChildren.indexOf(currentElement) - 1];
    }
    // если выше элемента нет, возвращаем текущий
    return currentElement;
  }
  // проверяем, есть ли родственник одного уровня ниже текущего элемента
  else {
    // если индекс текущего элемента меньше индекса родственника
    // значит, элемент ниже существует
    if (currentElement.index < [...directChildren].pop()!.index) {
      return directChildren[directChildren.indexOf(currentElement) + 1];
    }
    // если ниже элемента нет, возвращаем текущий
    return currentElement;
  }
};

// исключить элементы из массива
const excludeElementsFromList = ({
  list,
  elements,
}: {
  list: ITreeUnit[];
  elements: ITreeUnit[];
}): ITreeUnit[] => {
  const elementsSpecList: string[] = [
    ...elements.map((element) => element.spec),
  ];
  return list.filter((element) => !elementsSpecList.includes(element.spec));
};

// заменить значение поля order
const replaceOrder = ({
  oldOrder,
  newOrderStart,
  upOrDown,
}: {
  oldOrder: string;
  newOrderStart: string;
  upOrDown?: UpOrDown;
}): string => {
  let numberOfElementsToReplace: number = newOrderStart.split('|').length;
  if (upOrDown === 'UP') {
    numberOfElementsToReplace++;
  }
  if (upOrDown === 'DOWN') {
    numberOfElementsToReplace--;
  }
  const newOrderList = [
    ...newOrderStart.split('|'),
    ...oldOrder.split('|').slice(numberOfElementsToReplace, undefined),
  ].join('|');
  return newOrderList;
};

// перемещаем элементы, если родитель не меняется
const moveUpDownSameParent = ({
  currentElement,
  sibling,
  treeUnitList,
}: {
  currentElement: ITreeUnit;
  sibling: ITreeUnit;
  treeUnitList: ITreeUnit[];
}): ITreeUnit[] => {
  // здесь sibling точно есть
  // нашли все дочерние элементы родственника
  const siblingChildrenAllLevels = findChildrenAllLevels({
    parent: sibling,
    treeUnitList: treeUnitList,
  });
  // нашли все дочерние элементы текущего элемента
  const currentElementChildrenAllLevels = findChildrenAllLevels({
    parent: currentElement,
    treeUnitList: treeUnitList,
  });
  // заменили oder и orderAsNumber для всех дочерних элементов
  for (let i = 0; i < siblingChildrenAllLevels.length; i++) {
    const newOrderString = replaceOrder({
      oldOrder: siblingChildrenAllLevels[i].order,
      newOrderStart: currentElement.order,
    });
    siblingChildrenAllLevels[i] = {
      ...siblingChildrenAllLevels[i],
      order: newOrderString,
      orderAsNumber: getOrderAsNumber({ order: newOrderString }),
    };
  }
  for (let i = 0; i < currentElementChildrenAllLevels.length; i++) {
    const newOrderString = replaceOrder({
      oldOrder: currentElementChildrenAllLevels[i].order,
      newOrderStart: sibling.order,
    });
    currentElementChildrenAllLevels[i] = {
      ...currentElementChildrenAllLevels[i],
      order: newOrderString,
      orderAsNumber: getOrderAsNumber({ order: newOrderString }),
    };
  }
  const elements: ITreeUnit[] = [
    {
      ...currentElement,
      order: sibling.order,
      orderAsNumber: getOrderAsNumber({ order: sibling.order }),
    },
    {
      ...sibling,
      order: currentElement.order,
      orderAsNumber: getOrderAsNumber({ order: currentElement.order }),
    },
    ...siblingChildrenAllLevels,
    ...currentElementChildrenAllLevels,
  ];
  const newList: ITreeUnit[] = [
    ...excludeElementsFromList({ list: treeUnitList, elements }),
    ...elements,
  ].sort((a, b) => a.orderAsNumber - b.orderAsNumber);
  return newList;
};

const moveChildrenOneStepForUpDownParentChange = ({
  children,
  upOrDown,
}: {
  children: ITreeUnit[];
  upOrDown: UpOrDown;
}): ITreeUnit[] => {
  // если мы сдвигаем их вверх, то order первого прямого потомка
  // будет заканчиваться на 1
  // если мы сдвигаем их вниз, то order первого прямого потомка
  // будет заканчиваться на 2
  const localChildren = [...children];
  const list: ITreeUnit[] = [];
  if (upOrDown === 'UP') {
    const depth = localChildren[0].depth;
    const childrenToIterate = [...children].filter(
      (element) => element.depth === depth
    );
    for (let i = 0; i < childrenToIterate.length; i++) {
      const parent = childrenToIterate[i];
      const lastDigit = Number(parent.order.split('|').pop()!) - 1;
      const newOrder = [
        ...parent.order.split('|').slice(0, -1),
        lastDigit,
      ].join('|');
      const newParent = {
        ...parent,
        order: newOrder,
        orderAsNumber: getOrderAsNumber({ order: newOrder }),
      };
      list.push(newParent);
      const children = findChildrenAllLevels({
        parent,
        treeUnitList: localChildren,
      });
      for (let y = 0; y < children.length; y++) {
        const newOrderString = replaceOrder({
          oldOrder: children[y].order,
          newOrderStart: newParent.order,
        });
        list.push({
          ...children[i],
          order: newOrderString,
          orderAsNumber: getOrderAsNumber({ order: newOrderString }),
        });
      }
    }
  } else {
    const depth = localChildren[0].depth;
    const childrenToIterate = [...children].filter(
      (element) => element.depth === depth
    );
    for (let i = 0; i < childrenToIterate.length; i++) {
      const parent = childrenToIterate[i];
      const lastDigit = Number(parent.order.split('|').pop()!) + 1;
      const newOrder = [
        ...parent.order.split('|').slice(0, -1),
        lastDigit,
      ].join('|');
      const newParent = {
        ...parent,
        order: newOrder,
        orderAsNumber: getOrderAsNumber({ order: newOrder }),
      };
      list.push(newParent);
      const children = findChildrenAllLevels({
        parent,
        treeUnitList: localChildren,
      });
      for (let y = 0; y < children.length; y++) {
        const newOrderString = replaceOrder({
          oldOrder: children[y].order,
          newOrderStart: newParent.order,
        });
        list.push({
          ...children[i],
          order: newOrderString,
          orderAsNumber: getOrderAsNumber({ order: newOrderString }),
        });
      }
    }
  }
  return list;
};

// сдвиг оставшихся children вверх или вниз для
// localMoveDepthUp и localMoveDepthDown
const moveChildrenOneStepForDepthUpDown = ({
  parent,
  treeUnitList,
  fromWhichElement,
  upOrDown,
}: {
  parent: ITreeUnit;
  treeUnitList: ITreeUnit[];
  fromWhichElement: ITreeUnit;
  upOrDown: UpOrDown;
}): ITreeUnit[] => {
  if (upOrDown === 'UP') {
    const parentChildrenAllLevels = findChildrenAllLevels({
      parent,
      treeUnitList,
    });
    // смотрим, есть ли потомки ниже перемещаемого элемента
    const sibling = findElementSibling({
      currentElement: fromWhichElement,
      treeUnitList: treeUnitList,
      upOrDown: 'DOWN',
    });
    if (sibling.spec === fromWhichElement.spec) {
      return [];
    }
    // дочерние элементы ниже нажатого элемента
    const remainingChildren = parentChildrenAllLevels.filter(
      (element) => element.index >= sibling.index
    );
    const listToIterate = remainingChildren.filter(
      (element) => element.depth === fromWhichElement.depth
    );
    const list: ITreeUnit[] = [];
    for (let i = 0; i < listToIterate.length; i++) {
      const orderLastDigit =
        Number(listToIterate[i].order.split('|').pop()!) - 1;
      const newOrder = [
        ...listToIterate[i].order.split('|').slice(0, -1),
        orderLastDigit.toString(),
      ].join('|');
      list.push({
        ...listToIterate[i],
        order: newOrder,
        orderAsNumber: getOrderAsNumber({ order: newOrder }),
      });
      const children = findChildrenAllLevels({
        parent: listToIterate[i],
        treeUnitList: remainingChildren,
      });
      for (let y = 0; y < children.length; y++) {
        const newChildOrder = replaceOrder({
          newOrderStart: newOrder,
          oldOrder: children[y].order,
        });
        list.push({
          ...children[y],
          order: newChildOrder,
          orderAsNumber: getOrderAsNumber({ order: newChildOrder }),
        });
      }
    }
    return list;
  } else {
    const parentChildrenAllLevels = findChildrenAllLevels({
      parent,
      treeUnitList,
    });
    // смотрим, есть ли потомки ниже элемента, от которого отсчитываем
    const sibling = findElementSibling({
      currentElement: fromWhichElement,
      treeUnitList: treeUnitList,
      upOrDown: 'DOWN',
    });
    if (sibling.spec === fromWhichElement.spec) {
      return [];
    }
    // дочерние элементы ниже нажатого элемента
    const remainingChildren = parentChildrenAllLevels.filter(
      (element) => element.index >= sibling.index
    );
    const listToIterate = remainingChildren.filter(
      (element) => element.depth === fromWhichElement.depth
    );
    const list: ITreeUnit[] = [];
    for (let i = 0; i < listToIterate.length; i++) {
      const orderLastDigit =
        Number(listToIterate[i].order.split('|').pop()!) + 1;
      const newOrder = [
        ...listToIterate[i].order.split('|').slice(0, -1),
        orderLastDigit.toString(),
      ].join('|');
      list.push({
        ...listToIterate[i],
        order: newOrder,
        orderAsNumber: getOrderAsNumber({ order: newOrder }),
      });
      const children = findChildrenAllLevels({
        parent: listToIterate[i],
        treeUnitList: remainingChildren,
      });
      for (let y = 0; y < children.length; y++) {
        const newChildOrder = replaceOrder({
          newOrderStart: newOrder,
          oldOrder: children[y].order,
        });
        list.push({
          ...children[y],
          order: newChildOrder,
          orderAsNumber: getOrderAsNumber({ order: newChildOrder }),
        });
      }
    }
    return list;
  }
  return treeUnitList;
};

// метод по получению элементов, которые перемещаются при
// localMoveUp и localMoveDown и при изменении родителя
const getMovedElementsForUpDownParentChange = (
  data: ILocalMethodInput,
  parent: ITreeUnit,
  upOrDown: UpOrDown
): ITreeUnit[] => {
  const parentSibling = findElementSibling({
    currentElement: parent,
    treeUnitList: data.treeUnitList,
    upOrDown: upOrDown,
  });
  const parentSiblingChildrenDirect = findChildrenDirect({
    parent: parentSibling,
    treeUnitList: data.treeUnitList,
  });
  const sibling = [...parentSiblingChildrenDirect].pop();
  let newOrder = '';
  if (sibling) {
    newOrder =
      upOrDown === 'UP'
        ? [
            ...parentSibling.order.split('|'),
            (Number(sibling.order.split('|').pop()!) + 1).toString(),
          ].join('|')
        : [...parentSibling.order.split('|'), '1'].join('|');
  } else {
    newOrder = [...parentSibling.order.split('|'), '1'].join('|');
  }

  const newCurrentElement: ITreeUnit = {
    ...data.currentUnit,
    order: newOrder,
    orderAsNumber: getOrderAsNumber({ order: newOrder }),
    parentSpec: parentSibling.spec,
  };
  const currentElementChildrenAllLevels = findChildrenAllLevels({
    parent: data.currentUnit,
    treeUnitList: data.treeUnitList,
  });
  for (let i = 0; i < currentElementChildrenAllLevels.length; i++) {
    const newOrder = replaceOrder({
      newOrderStart: newCurrentElement.order,
      oldOrder: currentElementChildrenAllLevels[i].order,
    });
    currentElementChildrenAllLevels[i] = {
      ...currentElementChildrenAllLevels[i],
      order: newOrder,
      orderAsNumber: getOrderAsNumber({ order: newOrder }),
    };
  }
  return [newCurrentElement, ...currentElementChildrenAllLevels];
};

// метод по получению элементов, которые перемещаются при
// localMoveDepthUp и localMoveDepthDown
const getMovedElementsForDepthUpDown = (
  data: ILocalMethodInput,
  upOrDown: UpOrDown
): ITreeUnit[] => {
  if (upOrDown === 'UP') {
    const parent = data.treeUnitList.filter(
      (element) => element.spec === data.currentUnit.parentSpec
    )[0];
    const currentElementChildrenAllLevels = findChildrenAllLevels({
      parent: data.currentUnit,
      treeUnitList: data.treeUnitList,
    });
    const newOrder = [
      ...parent.order.split('|').slice(0, -1),
      Number(parent.order.split('|').pop()!) + 1,
    ].join('|');
    const newCurrentElement: ITreeUnit = {
      ...data.currentUnit,
      order: newOrder,
      orderAsNumber: getOrderAsNumber({
        order: newOrder,
      }),
      depth: data.currentUnit.depth - 1,
      parentSpec: parent.parentSpec,
    };
    for (let i = 0; i < currentElementChildrenAllLevels.length; i++) {
      const newOrder = replaceOrder({
        oldOrder: currentElementChildrenAllLevels[i].order,
        newOrderStart: newCurrentElement.order,
        upOrDown: upOrDown,
      });
      currentElementChildrenAllLevels[i] = {
        ...currentElementChildrenAllLevels[i],
        order: newOrder,
        orderAsNumber: getOrderAsNumber({ order: newOrder }),
        depth: currentElementChildrenAllLevels[i].depth - 1,
      };
    }
    return [newCurrentElement, ...currentElementChildrenAllLevels];
  } else {
    // TODO для MoveDepthDown
    const sibling = findElementSibling({
      currentElement: data.currentUnit,
      treeUnitList: data.treeUnitList,
      upOrDown: 'UP',
    });
    // sibling точно есть, иначе бы у нас не появилась кнопка
    const siblingChildrenDirect = findChildrenDirect({
      parent: sibling,
      treeUnitList: data.treeUnitList,
    });
    const newOrderLastDigit: number =
      siblingChildrenDirect.length === 0
        ? 1
        : Number([...siblingChildrenDirect].pop()!.order.split('|').pop()!) + 1;
    const newOrder = [...sibling.order.split('|'), newOrderLastDigit].join('|');
    const newCurrentElement: ITreeUnit = {
      ...data.currentUnit,
      parentSpec: sibling.spec,
      depth: data.currentUnit.depth + 1,
      order: newOrder,
      orderAsNumber: getOrderAsNumber({ order: newOrder }),
    };
    const currentElementChildrenAllLevels = findChildrenAllLevels({
      parent: data.currentUnit,
      treeUnitList: data.treeUnitList,
    });
    for (let i = 0; i < currentElementChildrenAllLevels.length; i++) {
      const newOrder = replaceOrder({
        oldOrder: currentElementChildrenAllLevels[i].order,
        newOrderStart: newCurrentElement.order,
        upOrDown: upOrDown,
      });
      currentElementChildrenAllLevels[i] = {
        ...currentElementChildrenAllLevels[i],
        order: newOrder,
        orderAsNumber: getOrderAsNumber({ order: newOrder }),
        depth: currentElementChildrenAllLevels[i].depth + 1,
      };
    }
    return [newCurrentElement, ...currentElementChildrenAllLevels];
  }
};

// метод по изменению видимости дочерних элементов
const localToggleChildrenVisibility = (
  data: ILocalMethodInput
): ITreeUnit[] => {
  // родительский элемент (для удобства)
  const parent = data.currentUnit;
  const children: ITreeUnit[] = findChildrenAllLevels({
    parent,
    treeUnitList: data.treeUnitList,
  });
  // если у него видны дочерние элементы, то скрываем всех потомков всех уровней
  if (parent.childrenVisible) {
    for (let i = 0; i < children.length; i++) {
      children[i] = { ...children[i], visible: false, childrenVisible: false };
    }
  }
  // если скрыты, то показываем только прямых потомков
  else {
    for (let i = 0; i < children.length; i++) {
      if (children[i].parentSpec === parent.spec) {
        children[i] = { ...children[i], visible: true };
      }
    }
  }
  return setNewIndexValues({
    treeUnitList: [
      ...beforeParentPart({ parent, treeUnitList: data.treeUnitList }),
      { ...parent, childrenVisible: !parent.childrenVisible },
      ...children,
      ...afterLastChildPart({
        lastChildIndex: children.pop()!.index,
        treeUnitList: data.treeUnitList,
      }),
    ],
  });
};

// метод по добавлению нового элемента в дерево (для первого уровня вложенности)
const localAddTreeUnitFirstLevel = (
  data: ILocalMethodInput,
  isModule: boolean
): ITreeUnit[] => {
  const parent = data.currentUnit;
  const children = findChildrenDirect({
    parent,
    treeUnitList: data.treeUnitList,
  });
  let lastChildIndex = [...children].pop()?.index ?? 0;
  let lastChildOrderLastDigit =
    lastChildIndex === 0
      ? 0
      : Number(
          [...children.filter((element) => element.depth === parent.depth + 1)]
            .pop()!
            .order.split('|')
            .pop()!
        );
  const newElement: ITreeUnit = {
    spec: `${parent.spec}${isModule ? 'newModule' : 'newLesson'}${
      lastChildOrderLastDigit + 1
    }`,
    kind: isModule ? 'unit' : 'lesson',
    title: `${parent.spec}${isModule ? 'newModule' : 'newLesson'}${
      lastChildOrderLastDigit + 1
    }`,
    order: `${lastChildOrderLastDigit + 1}`,
    orderAsNumber: getOrderAsNumber({
      order: `${lastChildOrderLastDigit + 1}`,
    }),
    depth: parent.depth + 1,
    index: 0,
    parentSpec: parent.spec,
    visible: true,
    childrenVisible: false,
  };
  const list: ITreeUnit[] = [...data.treeUnitList, newElement];
  for (let i = 0; i < list.length; i++) {
    // если родитель, отображаем дочерние элементы
    if (list[i].spec === parent.spec) {
      list[i] = { ...list[i], childrenVisible: true };
    }
    // если прямые потомки родителя, включаем их отображение
    if (list[i].parentSpec === parent.spec) {
      list[i] = { ...list[i], visible: true };
    }
  }
  return setNewIndexValues({
    treeUnitList: list.sort((a, b) => a.orderAsNumber - b.orderAsNumber),
  });
};

// метод по добавлению нового элемента в дерево
const localAddTreeUnit = (data: ILocalMethodInput): ITreeUnit[] => {
  // TODO запрашивать тип (kind) через контекстное меню
  const isModule = true;
  // при создании модулей 1-го уровня вложенности перенаправляем
  if (data.currentUnit.depth === 0) {
    return localAddTreeUnitFirstLevel(data, isModule);
  }
  // для удобства
  const parent = data.currentUnit;
  const children = findChildrenDirect({
    parent,
    treeUnitList: data.treeUnitList,
  });
  // находим индекс последнего дочернего элемента
  let lastChildIndex = [...children].pop()?.index ?? 0;
  // если есть дочерние элементы
  // находим последнее число в поле order для последнего дочернего элемента
  let lastChildOrderLastDigit =
    lastChildIndex === 0
      ? 0
      : Number([...children].pop()!.order.split('|').pop()!);
  const newElement: ITreeUnit = {
    spec: `${parent.spec}${isModule ? 'newModule' : 'newLesson'}${
      lastChildOrderLastDigit + 1
    }${uuidv4()}`,
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
  // новый массив с новым элементом
  const list: ITreeUnit[] = [...data.treeUnitList, newElement];
  for (let i = 0; i < list.length; i++) {
    // если родитель, отображаем дочерние элементы
    if (list[i].spec === parent.spec) {
      list[i] = { ...list[i], childrenVisible: true };
    }
    // если прямые потомки родителя, включаем их отображение
    if (list[i].parentSpec === parent.spec) {
      list[i] = { ...list[i], visible: true };
    }
  }
  // сортируем по orderAsNumber и присваиваем новые индексы
  return setNewIndexValues({
    treeUnitList: list.sort((a, b) => a.orderAsNumber - b.orderAsNumber),
  });
};

// удаление элемента и всех его дочерних элементов
// TODO сделать изменение order и orderAsNumber
const localDeleteTreeUnit = (data: ILocalMethodInput): ITreeUnit[] => {
  const parent = data.treeUnitList.filter(
    (element) => element.spec === data.currentUnit.parentSpec
  )[0];
  const deletedElements = data.treeUnitList.filter((element) =>
    element.order.startsWith(data.currentUnit.order)
  );
  const sibling = findElementSibling({
    currentElement: data.currentUnit,
    treeUnitList: data.treeUnitList,
    upOrDown: 'DOWN',
  });
  let movedChildren: ITreeUnit[] = [];
  // если sibling снизу существует,
  // двигаем дочерние элементы на 1 вверх
  if (sibling.spec !== data.currentUnit.spec) {
    // нашли все дочерние элементы текущего элемента
    const siblingChildrenAllLevels = findChildrenAllLevels({
      parent: sibling,
      treeUnitList: data.treeUnitList,
    });
    // заменили order и orderAsNumber для всех дочерних элементов
    for (let i = 0; i < siblingChildrenAllLevels.length; i++) {
      const newOrderString = replaceOrder({
        oldOrder: siblingChildrenAllLevels[i].order,
        newOrderStart: data.currentUnit.order,
      });
      siblingChildrenAllLevels[i] = {
        ...siblingChildrenAllLevels[i],
        order: newOrderString,
        orderAsNumber: getOrderAsNumber({ order: newOrderString }),
      };
    }
    movedChildren = [
      ...siblingChildrenAllLevels,
      {
        ...sibling,
        order: data.currentUnit.order,
        orderAsNumber: data.currentUnit.orderAsNumber,
      },
    ];
  }
  const remainingElements = excludeElementsFromList({
    elements: [...deletedElements, ...movedChildren],
    list: data.treeUnitList,
  });
  return setNewIndexValues({
    treeUnitList: [...movedChildren, ...remainingElements].sort(
      (a, b) => a.orderAsNumber - b.orderAsNumber
    ),
  });
};

// переместить элемент на 1 вверх
const localMoveUp = (data: ILocalMethodInput): ITreeUnit[] => {
  // находим родительский элемент нажатого элемента
  const parent = data.treeUnitList.filter(
    (element) => element.spec === data.currentUnit.parentSpec
  )[0];
  // если у элемента order заканчивается на 1 и мы нажимаем вверх
  // то родитель меняется
  const parentChanges =
    Number({ ...data.currentUnit }.order.split('|').pop()!) === 1;
  if (parentChanges) {
    // какие элементы перемещаются
    const movedElements = getMovedElementsForUpDownParentChange(
      data,
      parent,
      'UP'
    );
    // нужны все children от parent
    const children = findChildrenAllLevels({
      parent,
      treeUnitList: data.treeUnitList,
    });
    // какие элементы сдвинутся в результате перемещения movedElements
    const childrenToMove = excludeElementsFromList({
      list: children,
      elements: movedElements,
    });
    // сдвинутые элементы с уже измененными данными
    const movedChildren =
      childrenToMove.length === 0
        ? []
        : moveChildrenOneStepForUpDownParentChange({
            children: childrenToMove,
            upOrDown: 'UP',
          });
    const exclude: ITreeUnit[] = [...movedElements, ...movedChildren];
    // заменяем старые элементы на новые
    const list = excludeElementsFromList({
      list: data.treeUnitList,
      elements: exclude,
    });
    // сортируем и присваиваем новые индексы
    return setNewIndexValues({
      treeUnitList: [...list, ...movedElements, ...movedChildren].sort(
        (a, b) => a.orderAsNumber - b.orderAsNumber
      ),
    });
  }
  // случай, когда не меняем parent (не является крайним элементом среди дочерних)
  else {
    const sibling = findElementSibling({
      currentElement: data.currentUnit,
      treeUnitList: data.treeUnitList,
      upOrDown: 'UP',
    });
    return setNewIndexValues({
      treeUnitList: moveUpDownSameParent({
        currentElement: data.currentUnit,
        sibling,
        treeUnitList: data.treeUnitList,
      }),
    });
  }
};

// переместить элемент на 1 вниз
const localMoveDown = (data: ILocalMethodInput): ITreeUnit[] => {
  // находим родительский элемент нажатого элемента
  const parent = data.treeUnitList.filter(
    (element) => element.spec === data.currentUnit.parentSpec
  )[0];
  // если у элемента order заканчивается на число как у
  // последнего прямого дочернего компонента и мы нажимаем вверх
  // то родитель меняется
  const parentChanges =
    data.currentUnit.order.split('|').pop()! ===
    findChildrenDirect({ parent, treeUnitList: data.treeUnitList })
      .pop()!
      .order.split('|')
      .pop()!;
  if (parentChanges) {
    // смотри комментарии в localMoveUp
    const movedElements = getMovedElementsForUpDownParentChange(
      data,
      parent,
      'DOWN'
    );
    // мне нужны все children от parentSibling
    const parentSibling = findElementSibling({
      currentElement: parent,
      treeUnitList: data.treeUnitList,
      upOrDown: 'DOWN',
    });
    const childrenToMove = findChildrenAllLevels({
      parent: parentSibling,
      treeUnitList: data.treeUnitList,
    });
    const movedChildren =
      childrenToMove.length === 0
        ? []
        : moveChildrenOneStepForUpDownParentChange({
            children: childrenToMove,
            upOrDown: 'DOWN',
          });
    const exclude: ITreeUnit[] = [...movedElements, ...movedChildren];
    const list = excludeElementsFromList({
      list: data.treeUnitList,
      elements: exclude,
    });
    return setNewIndexValues({
      treeUnitList: [...list, ...movedElements, ...movedChildren].sort(
        (a, b) => a.orderAsNumber - b.orderAsNumber
      ),
    });
  }
  // случай, когда не меняем parent (не является крайним элементом среди дочерних)
  else {
    const sibling = findElementSibling({
      currentElement: data.currentUnit,
      treeUnitList: data.treeUnitList,
      upOrDown: 'DOWN',
    });
    return setNewIndexValues({
      treeUnitList: moveUpDownSameParent({
        currentElement: data.currentUnit,
        sibling,
        treeUnitList: data.treeUnitList,
      }),
    });
  }
};

// сделать дочерним элементом родителя родителя (переместить на уровень выше)
const localMoveDepthUp = (data: ILocalMethodInput): ITreeUnit[] => {
  // родитель текущего элемента
  const oldParent = data.treeUnitList.filter(
    (element) => element.spec === data.currentUnit.parentSpec
  )[0];
  // родитель родителя (новый родитель текущего элемента)
  const newParent = data.treeUnitList.filter(
    (element) => element.spec === oldParent.parentSpec
  )[0];
  // элементы, которые перемещаются в результате нажатия кнопки
  // (текущий элемент и его дочерние элементы)
  const movedElements = getMovedElementsForDepthUpDown(data, 'UP');
  // перемещенные элементы старого родителя
  const oldParentMovedChildren = moveChildrenOneStepForDepthUpDown({
    parent: oldParent,
    treeUnitList: data.treeUnitList,
    fromWhichElement: data.currentUnit,
    upOrDown: 'UP',
  });
  // перемещенные элементы нового родителя
  const newParentMovedChildren = moveChildrenOneStepForDepthUpDown({
    parent: newParent,
    treeUnitList: data.treeUnitList,
    fromWhichElement: oldParent,
    upOrDown: 'DOWN',
  });
  // какие элементы исключаем из общего списка (избегаем дублирования)
  const exclude = [
    ...oldParentMovedChildren,
    ...newParentMovedChildren,
    ...movedElements,
  ];
  // какие элементы не перемещались
  const remainingElements = excludeElementsFromList({
    elements: exclude,
    list: data.treeUnitList,
  });
  // объединяем два массива
  return setNewIndexValues({
    treeUnitList: [...remainingElements, ...exclude].sort(
      (a, b) => a.orderAsNumber - b.orderAsNumber
    ),
  });
};

// сделать дочерним элементом sibling (переместить на уровень ниже)
const localMoveDepthDown = (data: ILocalMethodInput): ITreeUnit[] => {
  const parent = data.treeUnitList.filter(
    (element) => element.spec === data.currentUnit.parentSpec
  )[0];
  // находим элементы, которые мы сдвинем вглубь
  // РАБОТАЕТ
  const movedElements = getMovedElementsForDepthUpDown(
    { currentUnit: data.currentUnit, treeUnitList: data.treeUnitList },
    'DOWN'
  );
  const parentMovedChildren = moveChildrenOneStepForDepthUpDown({
    parent: parent,
    treeUnitList: data.treeUnitList,
    fromWhichElement: data.currentUnit,
    upOrDown: 'UP',
  });
  // какие элементы исключаем из общего списка (избегаем дублирования)
  const exclude = [...parentMovedChildren, ...movedElements];
  // какие элементы не перемещались
  const remainingElements = excludeElementsFromList({
    elements: exclude,
    list: data.treeUnitList,
  });
  // объединяем два массива
  return setNewIndexValues({
    treeUnitList: [...remainingElements, ...exclude].sort(
      (a, b) => a.orderAsNumber - b.orderAsNumber
    ),
  });
};

const localCanToggleChildrenVisibility = (data: ILocalMethodInput): boolean => {
  if (
    findChildrenDirect({
      parent: data.currentUnit,
      treeUnitList: data.treeUnitList,
    }).length === 0
  ) {
    return false;
  }
  if (data.currentUnit.kind === 'lesson') {
    return false;
  }
  return true;
};

const localCanAddTreeUnit = (data: ILocalMethodInput): boolean => {
  if (
    data.currentUnit.kind === 'lesson' ||
    data.currentUnit.order.split('|').length === maxDepth
  ) {
    return false;
  }
  return true;
};

const localCanDeleteTreeUnit = (data: ILocalMethodInput): boolean => {
  if (data.currentUnit.kind === 'course') {
    return false;
  }
  return true;
};

// можно ли переместиться вверх
const localCanMoveUp = (data: ILocalMethodInput): boolean => {
  // для элемента курса никаких кнопок
  if (data.currentUnit.depth === 0) {
    return false;
  }
  // для первого уровня (прямых потомков курса)
  if (data.currentUnit.depth === 1) {
    // если у него есть родственник выше него, то может
    if (
      data.currentUnit.spec ===
      findElementSibling({
        currentElement: data.currentUnit,
        treeUnitList: data.treeUnitList,
        upOrDown: 'UP',
      }).spec
    ) {
      return false;
    } else {
      return true;
    }
  }
  // для всех остальных
  const parent = data.treeUnitList.filter(
    (element) => element.spec === data.currentUnit.parentSpec
  )[0];
  const parentSibling = findElementSibling({
    currentElement: parent,
    treeUnitList: data.treeUnitList,
    upOrDown: 'UP',
  });
  if (parent.spec === parentSibling.spec) {
    if (
      data.currentUnit.spec ===
      findChildrenDirect({ parent, treeUnitList: data.treeUnitList })[0].spec
    ) {
      return false;
    }
  }
  return true;
};

// TODO неполные условия
const localCanMoveDown = (data: ILocalMethodInput): boolean => {
  // для элемента курса никаких кнопок
  if (data.currentUnit.depth === 0) {
    return false;
  } else {
    // для первого уровня (прямых потомков курса)
    if (data.currentUnit.depth === 1) {
      // если у него есть родственник выше него, то может
      if (
        data.currentUnit.spec ===
        findElementSibling({
          currentElement: data.currentUnit,
          treeUnitList: data.treeUnitList,
          upOrDown: 'DOWN',
        }).spec
      ) {
        return false;
      } else {
        return true;
      }
    }
    // для всех остальных
    else {
      const parent = data.treeUnitList.filter(
        (element) => element.spec === data.currentUnit.parentSpec
      )[0];
      const parentSibling = findElementSibling({
        currentElement: parent,
        treeUnitList: data.treeUnitList,
        upOrDown: 'DOWN',
      });
      if (parent.spec === parentSibling.spec) {
        if (
          data.currentUnit.spec ===
          findChildrenDirect({ parent, treeUnitList: data.treeUnitList }).pop()!
            .spec
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }
};

const localCanMoveDepthUp = (data: ILocalMethodInput): boolean => {
  return data.currentUnit.depth !== 1 && data.currentUnit.depth !== 0;
};

const localCanMoveDepthDown = (data: ILocalMethodInput): boolean => {
  if (data.currentUnit.depth === 0) {
    return false;
  }
  if (
    data.currentUnit.spec !==
      findElementSibling({
        currentElement: data.currentUnit,
        treeUnitList: data.treeUnitList,
        upOrDown: 'UP',
      }).spec &&
    getMaxDepthFromList({
      listToCheck: findChildrenAllLevels({
        parent: data.currentUnit,
        treeUnitList: data.treeUnitList,
      }),
    }) < maxDepth
  ) {
    return true;
  }
  return false;
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
    setTreeUnitList(
      localToggleChildrenVisibility({
        currentUnit,
        treeUnitList,
      })
    );
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

  const moveDepthUp = ({ currentUnit }: { currentUnit: ITreeUnit }) => {
    if (localCanMoveDepthUp({ currentUnit, treeUnitList })) {
      setTreeUnitList(localMoveDepthUp({ currentUnit, treeUnitList }));
    }
  };

  const moveDepthDown = ({ currentUnit }: { currentUnit: ITreeUnit }) => {
    if (localCanMoveDepthDown({ currentUnit, treeUnitList })) {
      setTreeUnitList(localMoveDepthDown({ currentUnit, treeUnitList }));
    }
  };

  const moveUp = ({ currentUnit }: { currentUnit: ITreeUnit }) => {
    if (localCanMoveUp({ currentUnit, treeUnitList })) {
      setTreeUnitList(localMoveUp({ currentUnit, treeUnitList }));
    }
  };

  const moveDown = ({ currentUnit }: { currentUnit: ITreeUnit }) => {
    if (localCanMoveDown({ currentUnit, treeUnitList })) {
      setTreeUnitList(localMoveDown({ currentUnit, treeUnitList }));
    }
  };

  const canToggleChildrenVisibility = ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }): boolean => {
    return localCanToggleChildrenVisibility({ currentUnit, treeUnitList });
  };

  const canAddTreeUnit = ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }): boolean => {
    return localCanAddTreeUnit({ currentUnit, treeUnitList });
  };

  const canDeleteTreeUnit = ({ currentUnit }: { currentUnit: ITreeUnit }) => {
    return localCanDeleteTreeUnit({ currentUnit, treeUnitList });
  };

  const canMoveUp = ({ currentUnit }: { currentUnit: ITreeUnit }): boolean => {
    return localCanMoveUp({ currentUnit, treeUnitList });
  };

  const canMoveDown = ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }): boolean => {
    return localCanMoveDown({ currentUnit, treeUnitList });
  };

  const canMoveDepthUp = ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }): boolean => {
    return localCanMoveDepthUp({ currentUnit, treeUnitList });
  };

  const canMoveDepthDown = ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }): boolean => {
    return localCanMoveDepthDown({ currentUnit, treeUnitList });
  };

  return {
    treeUnitList,
    toggleChildrenVisibility,
    addTreeUnit,
    deleteTreeUnit,
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
  };
};
