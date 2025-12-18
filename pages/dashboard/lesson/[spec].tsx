"use client";
import LessonDashboard from "@components/Dashboard/LessonDashboard";
import { ICourse, ILesson } from "@custom-types/data/ICourse";
import { ChatHostsProvider } from "@hooks/useChatHosts";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { DefaultLayout } from "@layouts/DefaultLayout";
import Title from "@ui/Title/Title";
import { fetchWrapperStatic } from "@utils/fetchWrapper";
import { GetServerSideProps } from "next";
import { ReactNode } from "react";

function LessonDashboardPage(props: {
  entity: ILesson;
  courseSpec: string;
  courseAuthor: string;
}) {
  const refetchIntervalSeconds = 8;
  const { locale } = useLocale();
  const { user } = useUser();

  if (!user) return;

  return (
    <>
      <Title title={locale.titles.dashboard.lesson} />
      <ChatHostsProvider
        spec={props.entity.spec}
        entity={"lesson"}
        updateIntervalSeconds={refetchIntervalSeconds}
      >
        <LessonDashboard lesson={props.entity} />
      </ChatHostsProvider>
    </>
  );
}

LessonDashboardPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default LessonDashboardPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec || Array.isArray(query.spec)) {
    return {
      notFound: true,
    };
  }

  const courseSpec = req.url?.split("?course=").pop()!.split("&")[0].toString();

  const entityResponse = await fetchWrapperStatic({
    url: `course/${query.spec}`,
    req,
  });

  const courseResponse = await fetchWrapperStatic({
    url: `course/${courseSpec}`,
    req,
  });

  if (entityResponse.status === 200 && courseResponse.status === 200) {
    const entity = await entityResponse.json();
    const courseAuthor = (await courseResponse.json()).author;

    if (entity.kind === "lesson") {
      return {
        props: { entity: entity, courseSpec, courseAuthor },
      };
    }
  }

  return {
    notFound: true,
  };
};
