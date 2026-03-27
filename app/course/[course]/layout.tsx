import { ICourse } from "@custom-types/data/ICourse";
import { CourseProvider } from "@hooks/useCourse";
import { ErrorScreenAppDirectories } from "@ui/ErrorScreen/ErrorScreen";
import { fetchWrapperStaticApp } from "@utils/fetchWrapperServer";
import { Metadata, ResolvingMetadata } from "next";
import { cache, FC, ReactNode } from "react";

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

const getCourseData = async (spec: string) => {
  const [navResponse, course] = await Promise.all([
    fetchWrapperStaticApp({ url: `course/course_navigation_tree/${spec}` }),
    getCourse(spec),
  ]);

  if ("errorStatus" in course) {
    return { errorStatus: course.errorStatus };
  }

  const hasModerateRightsResponse = await fetchWrapperStaticApp({
    url: "rights",
    method: "POST",
    body: {
      action: "moderate",
      entity_spec: spec,
      entity: "course",
    },
  });

  if (!navResponse.ok) {
    return { errorStatus: 404 };
  }

  const navigation = await navResponse.json();
  // const hasModerateRights = await hasModerateRightsResponse.json();

  course.children = navigation.children;
  return {
    course,
    has_moderate_rights: hasModerateRightsResponse.ok,
    item: spec,
  };
};

type Params = Promise<{ course: string }>;

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const spec = (await params).course;
  const parentMetadata = await parent;
  const course = await getCourse(spec);

  if ("errorStatus" in course) {
    return {
      title: `${course.errorStatus}`,
    };
  }

  // TODO решить что делать с тайтлом
  return {
    title: `${parentMetadata.title?.absolute} | Курс  "${course.title}"`,
    description: parentMetadata.description,
    creator: course.author,
  };
}

const Layout: FC<{
  children: ReactNode;
  params: Promise<{ course: string }>;
}> = async ({ children, params }) => {
  const spec = (await params).course;
  const data = await getCourseData(spec);

  if ("errorStatus" in data) {
    return <ErrorScreenAppDirectories statusCode={data.errorStatus} />;
  }

  return (
    <CourseProvider spec={spec} initialData={data}>
      {children}
    </CourseProvider>
  );
};

export default Layout;
