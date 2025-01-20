import { FC, memo } from 'react';
import { ICourseAdd, IUnit } from '@custom-types/data/ICourse';
import { InputWrapper } from '@ui/basics';
import { UseFormReturnType } from '@mantine/form';
import { CourseUnitDisplay } from './TreeComponents/CourseUnit/CourseUnit';
import { useCourseTree } from '@hooks/useCourseTree';
import { useLocale } from '@hooks/useLocale';

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
