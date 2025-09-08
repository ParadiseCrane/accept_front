import { fetchWrapperStaticApp } from '@utils/fetchWrapperServer';
import { ICourse, ILesson, IUnit } from '@custom-types/data/ICourse';
import UnitEditPage from '@components/Course/Edit/UnitEditPage';
import LessonEditPage from '@components/Course/Edit/LessonEditPage';
import CourseEditPage from '@components/Course/Edit/CourseEditPage';

const getCourseData = async (
  spec: string
): Promise<{
  course: ICourse | IUnit | ILesson;
  depth: number;
}> => {
  const response = await fetchWrapperStaticApp({
    url: `course-edit/${spec}`,
  });

  if (!response.ok) {
    throw new Error(
      JSON.stringify({
        code: 404,
        message: `Failed to fetch data`,
      })
    );
  }

  const entity: { course: ICourse | IUnit | ILesson; depth: number } =
    await response.json();

  return {
    ...entity,
    course: { ...entity.course, spec },
  };
};

export default async function Page({
  params: params_promise,
}: {
  params: Promise<{ course: string; item?: string }>;
}) {
  const params = await params_promise;
  const data = await getCourseData(params.item ?? params.course);

  if (data.course.kind === 'course')
    return <CourseEditPage course={data.course} depth={data.depth} />;
  if (data.course.kind === 'unit')
    return <UnitEditPage unit={data.course} depth={data.depth} />;
  return <LessonEditPage lesson={data.course} depth={data.depth} />;
}
