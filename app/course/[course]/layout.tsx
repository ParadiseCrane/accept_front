import { ICourse } from '@custom-types/data/ICourse';
import { CourseProvider } from '@hooks/useCourse';
import { fetchWrapperStaticApp } from '@utils/fetchWrapperServer';
import { Metadata, ResolvingMetadata } from 'next';
import { cache, FC, ReactNode } from 'react';

const getCourse = cache(async (spec: string): Promise<ICourse> => {
  const courseResponse = await fetchWrapperStaticApp({ url: `course/${spec}` });
  if (!courseResponse.ok) {
    throw new Error(`Failed to fetch course '${spec}'`);
  }
  const course = (await courseResponse.json()) as ICourse;
  if (course.kind) {
    throw new Error(`Expected a course, got ${course.kind}`);
  }
  return course;
});

const getCourseData = async (spec: string) => {
  const [navResponse, course, hasModerateRightsResponse] = await Promise.all([
    fetchWrapperStaticApp({ url: `course/course_navigation_tree/${spec}` }),
    getCourse(spec),
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

  if (!navResponse.ok || !hasModerateRightsResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const navigation = await navResponse.json();
  const hasModerateRights = await hasModerateRightsResponse.json();

  course.children = navigation.children;
  return {
    course,
    has_moderate_rights: hasModerateRights,
    item: spec,
  };
};

type Params = Promise<{ course: string }>;

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const spec = (await params).course;
  const parentMetadata = await parent;
  const course = await getCourse(spec);

  // TODO решить что делать с тайтлом
  return {
    title: `${parentMetadata.title?.absolute} | Курс  "${course.title}"`,
    description: parentMetadata.description,
    creator: course.author,
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
