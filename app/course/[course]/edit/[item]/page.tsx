import { ICourse, IUnit, ILesson } from '@custom-types/data/ICourse';
import { fetchWrapperStaticApp } from '@utils/fetchWrapperServer';
import { Metadata, ResolvingMetadata } from 'next';
import { cache } from 'react';
import CourseEditClient from './ClientPage';

type ReturnType = { course: ICourse | IUnit | ILesson; depth: number };

const getCourseEdit = cache(async (spec: string): Promise<ReturnType> => {
  const response = await fetchWrapperStaticApp({ url: `course-edit/${spec}` });
  if (!response.ok) {
    throw new Error(`Failed to fetch '${spec}'`);
  }
  const entity: ReturnType = await response.json();

  return { ...entity, course: { ...entity.course, spec } };
});

interface PageProps {
  params: Promise<{ course: string; item: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const spec = (await params).item;

  const response = await getCourseEdit(spec);

  // TODO решить что делать с тайтлом
  return {
    title: `Accept | Редактирование "${response.course.title}"`,
  };
}

export default async function CourseEditPage(props: PageProps) {
  const spec = (await props.params).item;
  const data = await getCourseEdit(spec);

  return <CourseEditClient course={data.course} depth={data.depth} />;
}
