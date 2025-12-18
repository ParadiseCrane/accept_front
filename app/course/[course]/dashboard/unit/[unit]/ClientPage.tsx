"use client";

import UnitDashboard from "@components/Dashboard/UnitDashboard";
import { IUnit } from "@custom-types/data/ICourse";
import { ChatHostsProvider } from "@hooks/useChatHosts";
import { useUser } from "@hooks/useUser";

export default function UnitDashboardClient(props: {
  entity: IUnit;
  courseSpec: string;
  courseAuthor: string;
}) {
  const refetchIntervalSeconds = 8;
  const { user } = useUser();

  if (!user) return null;

  return (
    <ChatHostsProvider
      spec={props.courseSpec}
      entity={"course"}
      updateIntervalSeconds={refetchIntervalSeconds}
    >
      <UnitDashboard
        unit={props.entity}
        courseSpec={props.courseSpec}
        isAuthor={user && user.login === props.courseAuthor}
      />
    </ChatHostsProvider>
  );
}
