import { ICourse } from "@custom-types/data/ICourse";
import { fetchWrapperStaticApp } from "@utils/fetchWrapperServer";
import { cache, FC, ReactNode } from "react";
import CourseDashboardClient from "./ClientPage";
import { Metadata, ResolvingMetadata } from "next";
import { ErrorScreenAppDirectories } from "@ui/ErrorScreen/ErrorScreen";

const getCourse = cache(
  async (spec: string): Promise<ICourse | { errorStatus: number }> => {
    const courseResponse = await fetchWrapperStaticApp({
      url: `course/${spec}`,
    });
    if (!courseResponse.ok) {
      return { errorStatus: courseResponse.status };
    }
    const course = (await courseResponse.json()) as ICourse;
    if (course.kind) {
      return { errorStatus: 404 };
    }
    return course;
  },
);

interface PageProps {
  params: Promise<{ course: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const spec = (await params).course;

  const course = await getCourse(spec);

  if ("errorStatus" in course) {
    return {
      title: `${course.errorStatus} | Accept`,
    };
  }

  // TODO решить что делать с тайтлом
  return {
    title: `Accept | Управление "${course.title}"`,
  };
}

export default async function CourseDashboardPage(props: PageProps) {
  const spec = (await props.params).course;
  const data = await getCourse(spec);

  if ("errorStatus" in data) {
    return <ErrorScreenAppDirectories statusCode={data.errorStatus} />;
  }

  return <CourseDashboardClient entity={data} courseAuthor={data.author} />;
}
