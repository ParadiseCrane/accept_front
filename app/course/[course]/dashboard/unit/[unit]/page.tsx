import { ICourse, IUnit } from "@custom-types/data/ICourse";
import { fetchWrapperStaticApp } from "@utils/fetchWrapperServer";
import { cache } from "react";
import UnitDashboardClient from "./ClientPage";
import { Metadata, ResolvingMetadata } from "next";

const getUnit = cache(async (spec: string): Promise<IUnit> => {
  const unitResponse = await fetchWrapperStaticApp({ url: `course/${spec}` });
  if (!unitResponse.ok) {
    throw new Error(
      JSON.stringify({
        code: 404,
        message: `Failed to fetch data`,
      }),
    );
  }
  const unit = (await unitResponse.json()) as IUnit;
  if (unit.kind !== "unit") {
    throw new Error(
      JSON.stringify({
        code: 404,
        message: `Failed to fetch data`,
      }),
    );
  }
  return unit;
});

const getCourse = cache(async (spec: string): Promise<ICourse> => {
  const courseResponse = await fetchWrapperStaticApp({ url: `course/${spec}` });
  if (!courseResponse.ok) {
    throw new Error(
      JSON.stringify({
        code: 404,
        message: `Failed to fetch data`,
      }),
    );
  }
  const course = (await courseResponse.json()) as ICourse;
  if (course.kind) {
    throw new Error(
      JSON.stringify({
        code: 404,
        message: `Failed to fetch data`,
      }),
    );
  }
  return course;
});

interface PageProps {
  params: Promise<{ course: string; unit: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const spec = (await params).unit;

  const unit = await getUnit(spec);

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

  return (
    <UnitDashboardClient
      entity={unit}
      courseSpec={courseSpec}
      courseAuthor={course.author}
    />
  );
}
