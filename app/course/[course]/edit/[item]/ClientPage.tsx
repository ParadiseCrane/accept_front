import CourseEditPage from '@components/Course/Edit/CourseEditPage';
import LessonEditPage from '@components/Course/Edit/LessonEditPage';
import UnitEditPage from '@components/Course/Edit/UnitEditPage';
import { ICourse, ILesson, IUnit } from '@custom-types/data/ICourse';

function CourseEditClient(props: {
  course: ICourse | IUnit | ILesson;
  depth: number;
}) {
  if (props.course.kind === 'course')
    return <CourseEditPage course={props.course} depth={props.depth} />;

  if (props.course.kind === 'unit')
    return <UnitEditPage course={props.course} depth={props.depth} />;

  return <LessonEditPage course={props.course} depth={props.depth} />;
}

export default CourseEditClient;
