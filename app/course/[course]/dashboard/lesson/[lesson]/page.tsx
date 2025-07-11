import { fetchWrapperStaticApp } from '@utils/fetchWrapperServer';
import ClientPage from './ClientPage';

async function getLesson(course_spec: string, lesson_spec: string) {
  const [courseResponse, lessonResponse] = await Promise.all([
    fetchWrapperStaticApp({ url: `course/${course_spec}` }),
    fetchWrapperStaticApp({ url: `course/${lesson_spec}` }),
  ]);

  if (!courseResponse.ok || !lessonResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const lesson = await lessonResponse.json();
  const course = await courseResponse.json();

  if (lesson.kind !== 'lesson') {
    throw new Error('Not a lesson');
  }

  return { lesson, course };
}

export default async function LessonDashboardPage({
  params,
}: {
  params: { course: string; lesson: string };
}) {
  const { lesson, course } = await getLesson(params.course, params.lesson);

  return (
    <ClientPage
      lesson={lesson}
      courseSpec={params.course}
      courseAuthor={course.author}
    />
  );
}
