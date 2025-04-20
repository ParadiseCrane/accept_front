import {
  ICourseModel,
  IGroupOpenness,
  IUnit,
} from '@custom-types/data/ICourse';
import { useCourseGroupOpennessTree } from '@hooks/useCourseTree';
import { useLocale } from '@hooks/useLocale';
import { InputWrapper } from '@ui/basics';
import { FC, memo } from 'react';
import { CourseUnitOpenness } from '../CourseUnitOpenness/CourseUnitOpenness';
import { useSearchParams } from 'next/navigation';

const flattenCourse = ({
  course,
  children,
}: {
  course: ICourseModel;
  children: IUnit[];
}): IUnit[] => {
  const courseAsUnit: IUnit = {
    kind: course.kind,
    order: '0',
    spec: course.spec,
    title: course.title,
  };
  let units: IUnit[] = [courseAsUnit];
  if (children.length === 0) return units;
  for (var i = 0; i < children.length; i++) {
    units = [...units, children[i]];
  }
  return units;
};

const GroupOpennessTree: FC<{
  course: ICourseModel;
  groupOpennessList: IGroupOpenness[];
  toggleGroupOpennessList: (spec: string) => Promise<void>;
}> = ({ course, groupOpennessList, toggleGroupOpennessList }) => {
  const params = useSearchParams();
  const units = flattenCourse({ course, children: course.children });
  const { locale } = useLocale();
  const { treeUnitList, actions, checkers } = useCourseGroupOpennessTree({
    course: units[0],
    allChildren: units,
    groupOpennessList,
    groupSpec: params.get('group')!,
  });

  return (
    <InputWrapper label={locale.course.courseStructure}>
      {treeUnitList
        .filter((element) => element.visible)
        .map((unit) => (
          <CourseUnitOpenness
            currentUnit={unit}
            actions={actions}
            checkers={checkers}
            key={unit.spec}
            toggleOpennessTreeUnit={actions.toggleElementOpenness}
          />
        ))}
    </InputWrapper>
  );
};

export default memo(GroupOpennessTree);
