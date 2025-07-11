import { ICourse } from '@custom-types/data/ICourse';
import CourseClient from './ClientPage';
import { fetchWrapperStaticApp } from '@utils/fetchWrapperServer';

async function getCourseData(spec: string, item: string) {
  const [navResponse, courseResponse, hasModerateRightsResponse] =
    await Promise.all([
      fetchWrapperStaticApp({ url: `course/course_navigation_tree/${spec}` }),
      fetchWrapperStaticApp({ url: `course/${spec}` }),
      fetchWrapperStaticApp({
        url: 'rights',
        method: 'POST',
        body: {
          action: 'moderate',
          entity_spec: spec,
          entity: 'course',
        },
      }),
    ]);

  if (!navResponse.ok || !courseResponse.ok || !hasModerateRightsResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const navigation = await navResponse.json();
  const hasModerateRights = await hasModerateRightsResponse.json();
  const course = (await courseResponse.json()) as ICourse;
  course.children = navigation.children;
  if (course.kind !== 'course') {
    throw new Error('Not a course');
  }

  return {
    course,
    has_moderate_rights: hasModerateRights,
    item: item || spec,
  };
}

export default async function CoursePage(props: {
  params: Promise<{ course: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const item = !searchParams
    ? params.course
    : Array.isArray(searchParams.item)
      ? searchParams.item[0]
      : searchParams.item || params.course;

  const data = await getCourseData(params.course, item);

  return <CourseClient initialData={data} initialItem={data.item} />;
}
