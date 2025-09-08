import { ICourse } from '@custom-types/data/ICourse';
import { fetchWrapperStaticApp } from '@utils/fetchWrapperServer';
import { cache, FC, ReactNode } from 'react';
import CourseDashboardClient from './ClientPage';
import { Metadata, ResolvingMetadata } from 'next';

const getCourse = cache(async (spec: string): Promise<ICourse> => {
  const courseResponse = await fetchWrapperStaticApp({ url: `course/${spec}` });
  if (!courseResponse.ok) {
    throw new Error(
      JSON.stringify({
        code: courseResponse.status,
        message: `Failed to fetch course '${spec}'`,
      })
    );
  }
  const course = (await courseResponse.json()) as ICourse;
  if (course.kind) {
    throw new Error(
      JSON.stringify({
        code: 404,
        message: `Expected a course, got '${course.kind}'`,
      })
    );
  }
  return course;
});

interface PageProps {
  params: Promise<{ course: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const spec = (await params).course;

  const course = await getCourse(spec);

  // TODO решить что делать с тайтлом
  return {
    title: `Accept | Управление "${course.title}"`,
  };
}

export default async function CourseDashboardPage(props: PageProps) {
  const spec = (await props.params).course;
  const data = await getCourse(spec);

  return <CourseDashboardClient entity={data} courseAuthor={data.author} />;
}
