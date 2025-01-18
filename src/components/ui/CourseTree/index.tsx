import { FC, memo } from 'react';
import { ICourseAdd, IUnit } from '@custom-types/data/ICourse';
import { InputWrapper } from '@ui/basics';
import { UseFormReturnType } from '@mantine/form';
import { CourseUnitDisplay } from './TreeComponents/CourseUnit/CourseUnit';
import { useCourseTree } from '@hooks/useCourseTree';
import { useLocale } from '@hooks/useLocale';

// const unitsInitialValue: IUnit[] = [
//   {
//     spec: 'spec0',
//     kind: 'course',
//     title: 'Название курса',
//     order: '0',
//   },
//   {
//     spec: 'spec1',
//     kind: 'unit',
//     title: 'Модуль 1',
//     order: '1',
//   },
//   {
//     spec: 'spec1.1',
//     kind: 'unit',
//     title: 'Модуль 1.1',
//     order: '1|1',
//   },
//   {
//     spec: 'spec1.2',
//     kind: 'unit',
//     title: 'Модуль 1.2',
//     order: '1|2',
//   },
//   {
//     spec: 'spec1.3',
//     kind: 'unit',
//     title: 'Модуль 1.3',
//     order: '1|3',
//   },
//   {
//     spec: 'spec2',
//     kind: 'unit',
//     title: 'Модуль 2',
//     order: '2',
//   },
//   {
//     spec: 'spec2.1',
//     kind: 'unit',
//     title: 'Модуль 2.1',
//     order: '2|1',
//   },
//   {
//     spec: 'spec2.2',
//     kind: 'unit',
//     title: 'Модуль 2.2',
//     order: '2|2',
//   },
//   {
//     spec: 'spec2.3',
//     kind: 'unit',
//     title: 'Модуль 2.3',
//     order: '2|3',
//   },
//   {
//     spec: 'spec2.3.1',
//     kind: 'unit',
//     title: 'Модуль 2.3.1',
//     order: '2|3|1',
//   },
//   {
//     spec: 'spec3',
//     kind: 'unit',
//     title: 'Модуль 3',
//     order: '3',
//   },
//   {
//     spec: 'spec3.1',
//     kind: 'unit',
//     title: 'Модуль 3.1',
//     order: '3|1',
//   },
//   {
//     spec: 'spec3.2',
//     kind: 'unit',
//     title: 'Модуль 3.2',
//     order: '3|2',
//   },
//   {
//     spec: 'spec3.3',
//     kind: 'unit',
//     title: 'Модуль 3.3',
//     order: '3|3',
//   },
//   {
//     spec: 'spec4',
//     kind: 'unit',
//     title: 'Модуль 4',
//     order: '4',
//   },
//   {
//     spec: 'spec4.1',
//     kind: 'unit',
//     title: 'Модуль 4.1',
//     order: '4|1',
//   },
//   {
//     spec: 'spec4.2',
//     kind: 'unit',
//     title: 'Модуль 4.2',
//     order: '4|2',
//   },
//   {
//     spec: 'spec4.3',
//     kind: 'unit',
//     title: 'Модуль 4.3',
//     order: '4|3',
//   },
//   {
//     spec: 'spec5',
//     kind: 'unit',
//     title: 'Модуль 5',
//     order: '5',
//   },
//   {
//     spec: 'spec5.1',
//     kind: 'unit',
//     title: 'Модуль 5.1',
//     order: '5|1',
//   },
//   {
//     spec: 'spec5.2',
//     kind: 'unit',
//     title: 'Модуль 5.2',
//     order: '5|2',
//   },
//   {
//     spec: 'spec5.2.1',
//     kind: 'unit',
//     title: 'Модуль 5.2.1',
//     order: '5|2|1',
//   },
// ];

const CourseTree: FC<{
  titleProps: any;
  initialUnits: IUnit[];
  form: UseFormReturnType<ICourseAdd, (values: ICourseAdd) => ICourseAdd>;
}> = ({ titleProps, initialUnits, form }) => {
  const { locale } = useLocale();
  const { treeUnitList, actions, checkers } = useCourseTree({
    courseUnitList: initialUnits,
    form,
    newUnitTitleLocale: {
      lesson: locale.ui.courseTree.newLesson,
      unit: locale.ui.courseTree.newUnit,
    },
  });
  console.log('tree units', treeUnitList);

  return (
    <InputWrapper label={'Название и структура'}>
      {treeUnitList
        .filter((element) => element.visible)
        .map((unit) => (
          <CourseUnitDisplay
            currentUnit={unit}
            actions={actions}
            checkers={checkers}
            key={unit.spec}
          />
        ))}
    </InputWrapper>
  );
};

export { CourseTree };
