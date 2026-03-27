import { fetchWrapperStaticApp } from "@utils/fetchWrapperServer";
import ClientPage from "./ClientPage";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { ILesson } from "@custom-types/data/ICourse";
import { ErrorScreenAppDirectories } from "@ui/ErrorScreen/ErrorScreen";

const getLesson = cache(
  async (lesson_spec: string): Promise<ILesson | { errorStatus: number }> => {
    const lessonResponse = await fetchWrapperStaticApp({
      url: `course/${lesson_spec}`,
    });

    if (!lessonResponse.ok) {
      return { errorStatus: lessonResponse.status };
    }

    const lesson = (await lessonResponse.json()) as ILesson;

    if (lesson.kind !== "lesson") {
      return { errorStatus: 404 };
    }

    return lesson;
  },
);

type PageProps = {
  params: Promise<{ course: string; lesson: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const spec = (await params).lesson;

  const lesson = await getLesson(spec);

  if ("errorStatus" in lesson) {
    return {
      title: `${lesson.errorStatus}`,
    };
  }

  // TODO решить что делать с тайтлом
  return {
    title: `Accept | Управление "${lesson.title}"`,
  };
}

export default async function LessonDashboardPage(props: PageProps) {
  const params = await props.params;
  const lesson = await getLesson(params.lesson);

  if ("errorStatus" in lesson) {
    return <ErrorScreenAppDirectories statusCode={lesson.errorStatus} />;
  }

  return <ClientPage lesson={lesson} />;
}
