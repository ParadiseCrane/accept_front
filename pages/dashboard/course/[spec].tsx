"use client";
import CourseDashboard from "@components/Dashboard/CourseDashboard";
import { ICourse } from "@custom-types/data/ICourse";
import { ChatHostsProvider } from "@hooks/useChatHosts";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { DefaultLayout } from "@layouts/DefaultLayout";
import Title from "@ui/Title/Title";
import { fetchWrapperStatic } from "@utils/fetchWrapper";
import { GetServerSideProps } from "next";
import { ReactNode } from "react";

function CourseDashboardPage(props: { entity: ICourse; courseAuthor: string }) {
  const { locale } = useLocale();
  const refetchIntervalSeconds = 8;
  const { user } = useUser();

  if (!user) return;

  return (
    <>
      <Title title={locale.titles.dashboard.course} />
      <ChatHostsProvider
        spec={props.entity.spec}
        entity={"course"}
        updateIntervalSeconds={refetchIntervalSeconds}
      >
        <CourseDashboard
          course={props.entity}
          courseSpec={props.entity.spec}
          isAuthor={user && user.login === props.courseAuthor}
        />
      </ChatHostsProvider>
    </>
  );
}

CourseDashboardPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CourseDashboardPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec || Array.isArray(query.spec)) {
    return {
      notFound: true,
    };
  }

  const courseResponse = await fetchWrapperStatic({
    url: `course/${query.spec}`,
    req,
  });

  if (courseResponse.status === 200) {
    const entity: ICourse = await courseResponse.json();
    const courseAuthor = entity.author;

    return {
      props: { entity: entity, courseAuthor },
    };
  }

  return {
    notFound: true,
  };
};
