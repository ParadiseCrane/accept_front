import { ICourseAdd, IUnit } from '@custom-types/data/ICourse';
import { useCourseAddTree } from '@hooks/useCourseTree';
import { useLocale } from '@hooks/useLocale';
import { UseFormReturnType } from '@mantine/form';
import { InputWrapper } from '@ui/basics';
import { FC, memo } from 'react';

import { CourseUnitDisplay } from './TreeComponents/CourseUnit/CourseUnit';

const CourseTree: FC<{
  titleProps: any;
  initialUnits: IUnit[];
  form: UseFormReturnType<ICourseAdd, (values: ICourseAdd) => ICourseAdd>;
}> = ({ titleProps, initialUnits, form }) => {
  const { locale } = useLocale();
  const { treeUnitList, actions, checkers } = useCourseAddTree({
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
