import { fetchWrapperStaticApp } from "@utils/fetchWrapperServer";
import { ICourse, ILesson, IUnit } from "@custom-types/data/ICourse";
import UnitEditPage from "@components/Course/Edit/UnitEditPage";
import LessonEditPage from "@components/Course/Edit/LessonEditPage";
import CourseEditPage from "@components/Course/Edit/CourseEditPage";
import { ErrorScreenAppDirectories } from "@ui/ErrorScreen/ErrorScreen";

const getCourseData = async (
  spec: string,
): Promise<
  | {
      course: ICourse | IUnit | ILesson;
      depth: number;
    }
  | { errorStatus: number }
> => {
  const response = await fetchWrapperStaticApp({
    url: `course-edit/${spec}`,
  });

  if (!response.ok) {
    return { errorStatus: response.status };
  }

  const entity: { course: ICourse | IUnit | ILesson; depth: number } =
    await response.json();

  return {
    ...entity,
    course: { ...entity.course, spec },
  };
};

export default async function Page({
  params: params_promise,
}: {
  params: Promise<{ course: string; item?: string }>;
}) {
  const params = await params_promise;
  const data = await getCourseData(params.item ?? params.course);

  if ("errorStatus" in data) {
    return <ErrorScreenAppDirectories statusCode={data.errorStatus} />;
  }

  if (data.course.kind === "course")
    return <CourseEditPage course={data.course} depth={data.depth} />;
  if (data.course.kind === "unit")
    return <UnitEditPage unit={data.course} depth={data.depth} />;
  return <LessonEditPage lesson={data.course} depth={data.depth} />;
}
