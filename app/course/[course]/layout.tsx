import { ICourse } from '@custom-types/data/ICourse';
import { CourseProvider } from '@hooks/useCourse';
import { fetchWrapperStaticApp } from '@utils/fetchWrapperServer';
import { FC, ReactNode } from 'react';

async function getCourseData(spec: string) {
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
    item: spec,
  };
}

const Layout: FC<{
  children: ReactNode;
  params: Promise<{ course: string }>;
}> = async ({ children, params }) => {
  const spec = (await params).course;
  const data = await getCourseData(spec);
  return (
    <CourseProvider spec={spec} initialData={data}>
      {children}
    </CourseProvider>
  );
};

export default Layout;
