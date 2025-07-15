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
    throw new Error('Failed to fetch data');
  }

  const entity: { course: ICourse | IUnit | ILesson; depth: number } =
    await response.json();

  return {
    ...entity,
    course: { ...entity.course, spec },
  };
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { spec: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const item = (await searchParams)['item'];
  if (typeof item == 'object')
    throw new Error('Item props expected to be a string');
  const data = await getCourseData(item ?? params.spec);

  if (data.course.kind === 'course')
    return <CourseEditPage course={data.course} depth={data.depth} />;
  if (data.course.kind === 'unit')
    return <UnitEditPage course={data.course} depth={data.depth} />;
  return <LessonEditPage course={data.course} depth={data.depth} />;
}
