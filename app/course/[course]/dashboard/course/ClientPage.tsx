"use client";

import CourseDashboard from "@components/Dashboard/CourseDashboard";
import { ICourse } from "@custom-types/data/ICourse";
import { ChatHostsProvider } from "@hooks/useChatHosts";
import { useUser } from "@hooks/useUser";

export default function CourseDashboardClient(props: {
  entity: ICourse;
  courseAuthor: string;
}) {
  const refetchIntervalSeconds = 8;
  const { user, isAdmin } = useUser();

  if (!user) return null;

  return (
    <ChatHostsProvider
      spec={props.entity.spec}
      entity={"course"}
      updateIntervalSeconds={refetchIntervalSeconds}
    >
      <CourseDashboard
        course={props.entity}
        courseSpec={props.entity.spec}
        isAuthor={(user && user.login === props.courseAuthor) || isAdmin}
      />
    </ChatHostsProvider>
  );
}
