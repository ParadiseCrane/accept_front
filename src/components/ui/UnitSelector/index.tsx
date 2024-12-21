import { ActionIcon, Group, TextInput } from '@mantine/core';
import { FC, memo, useMemo, useState } from 'react';
import UnitDisplay from './UnitDisplay';
import {
  ICourseAdd,
  ICourseUnit,
  ITreeUnit,
  IUnit,
} from '@custom-types/data/ICourse';
import { InputWrapper } from '@ui/basics';
import { Plus } from 'tabler-icons-react';
import { UseFormReturnType } from '@mantine/form';
import { CourseUnitDisplay } from './TestComponents/CourseUnitDisplay';
import { useCourseTree } from '@hooks/useCourseTree';

const unitsInitialValue: ICourseUnit[] = [
  {
    spec: 'spec1',
    kind: 'unit',
    title: 'Модуль 1',
    order: '1',
  },
  {
    spec: 'spec11',
    kind: 'lesson',
    title: 'Урок 1',
    order: '1|1',
  },
  {
    spec: 'spec12',
    kind: 'lesson',
    title: 'Урок 2',
    order: '1|2',
  },
  {
    spec: 'spec13',
    kind: 'lesson',
    title: 'Урок 3',
    order: '1|3',
  },
  {
    spec: 'spec2',
    kind: 'unit',
    title: 'Модуль 2',
    order: '2',
  },
  {
    spec: 'spec21',
    kind: 'lesson',
    title: 'Урок 1',
    order: '2|1',
  },
  {
    spec: 'spec22',
    kind: 'lesson',
    title: 'Урок 2',
    order: '2|2',
  },
  {
    spec: 'spec23',
    kind: 'lesson',
    title: 'Урок 3',
    order: '2|3',
  },
  {
    spec: 'spec3',
    kind: 'unit',
    title: 'Модуль 3',
    order: '3',
  },
  {
    spec: 'spec31',
    kind: 'lesson',
    title: 'Урок 1',
    order: '3|1',
  },
  {
    spec: 'spec32',
    kind: 'lesson',
    title: 'Урок 2',
    order: '3|2',
  },
  {
    spec: 'spec33',
    kind: 'lesson',
    title: 'Урок 3',
    order: '3|3',
  },
  {
    spec: 'spec4',
    kind: 'unit',
    title: 'Модуль 4',
    order: '4',
  },
  {
    spec: 'spec41',
    kind: 'lesson',
    title: 'Урок 1',
    order: '4|1',
  },
  {
    spec: 'spec42',
    kind: 'lesson',
    title: 'Урок 2',
    order: '4|2',
  },
  {
    spec: 'spec43',
    kind: 'lesson',
    title: 'Урок 3',
    order: '4|3',
  },
  {
    spec: 'spec5',
    kind: 'unit',
    title: 'Модуль 5',
    order: '5',
  },
];

const UnitSelector: FC<{
  title_props: any;
  initial_units: IUnit[];
  form: UseFormReturnType<ICourseAdd, (values: ICourseAdd) => ICourseAdd>;
}> = ({ title_props, initial_units, form }) => {
  // const units = useMemo(() => [...initial_units], [initial_units]);
  const {
    treeUnitList,
    addTreeUnit,
    deleteTreeUnit,
    toggleChildrenVisibility,
  } = useCourseTree({ courseUnitList: unitsInitialValue });
  console.log('tree units', treeUnitList);

  return (
    <InputWrapper label={'Название'}>
      <Group gap={0}>
        <TextInput {...title_props} />
        <ActionIcon kind="positive" variant="outline">
          <Plus />
        </ActionIcon>
      </Group>

      {treeUnitList.map((unit, index) => (
        <CourseUnitDisplay
          treeUnit={unit}
          addTreeUnit={addTreeUnit}
          deleteTreeUnit={deleteTreeUnit}
          toggleChildrenVisibility={toggleChildrenVisibility}
        />
      ))}
      {/* {initial_units.map((unit, index) => (
        <UnitDisplay key={index} unit={unit} />
      ))} */}
    </InputWrapper>
  );
};

export default memo(UnitSelector);
