import { ICourse, ILesson, IUnit } from "@custom-types/data/ICourse";
import ClientPage from "./ClientPage";
import { fetchWrapperStaticApp } from "@utils/fetchWrapperServer";

export default async function CoursePage(props: {
  params: Promise<{ course: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const currentSpec = searchParams["item"];

  // const current = await fetchWrapperStaticApp({
  //   url: `course/${currentSpec || params.course}`,
  //   method: "GET",
  //   cacheTags: [`course-${currentSpec}`], // for future migrations of api routes to app router
  // });
  // if (current.ok) {
  // const item = (await current.json()) as ICourse | IUnit | ILesson;
  return <ClientPage spec={params.course} />;
  // }
}
