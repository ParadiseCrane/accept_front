import { ICourse, IUnit } from "@custom-types/data/ICourse";
import { fetchWrapperStaticApp } from "@utils/fetchWrapperServer";
import { cache } from "react";
import UnitDashboardClient from "./ClientPage";
import { Metadata, ResolvingMetadata } from "next";
import { ErrorScreenAppDirectories } from "@ui/ErrorScreen/ErrorScreen";

const getUnit = cache(
  async (spec: string): Promise<IUnit | { errorStatus: number }> => {
    const unitResponse = await fetchWrapperStaticApp({ url: `course/${spec}` });
    if (!unitResponse.ok) {
      return { errorStatus: unitResponse.status };
    }
    const unit = (await unitResponse.json()) as IUnit;
    if (unit.kind !== "unit") {
      return { errorStatus: 404 };
    }
    return unit;
  },
);

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
  params: Promise<{ course: string; unit: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const spec = (await params).unit;

  const unit = await getUnit(spec);

  if ("errorStatus" in unit) {
    return {
      title: `${unit.errorStatus}`,
    };
  }

  // TODO решить что делать с тайтлом
  return {
    title: `Accept | Управление "${unit.title}"`,
  };
}

export default async function UnitDashboardPage(props: PageProps) {
  const courseSpec = (await props.params).course;
  const unitSpec = (await props.params).unit;
  const unit = await getUnit(unitSpec);
  const course = await getCourse(courseSpec);

  if ("errorStatus" in unit || "errorStatus" in course) {
    const errorStatus =
      "errorStatus" in unit
        ? unit.errorStatus
        : "errorStatus" in course
          ? course.errorStatus
          : 404;
    return <ErrorScreenAppDirectories statusCode={errorStatus} />;
  }

  return (
    <UnitDashboardClient
      entity={unit}
      courseSpec={courseSpec}
      courseAuthor={course.author}
    />
  );
}
