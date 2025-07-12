import { fetchWrapperStaticApp } from '@utils/fetchWrapperServer';
import ClientPage from './ClientPage';

async function getLesson(lesson_spec: string) {
  const lessonResponse = await fetchWrapperStaticApp({
    url: `course/${lesson_spec}`,
  });

  if (!lessonResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const lesson = await lessonResponse.json();

  if (lesson.kind !== 'lesson') {
    throw new Error('Not a lesson');
  }

  return { lesson };
}

export default async function LessonDashboardPage(props: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const params = await props.params;
  const { lesson } = await getLesson(params.lesson);

  return <ClientPage lesson={lesson} />;
}
