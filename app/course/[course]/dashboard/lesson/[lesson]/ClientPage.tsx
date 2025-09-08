"use client";

import LessonDashboard from "@components/Dashboard/LessonDashboard";
import { ILesson } from "@custom-types/data/ICourse";
import { ChatHostsProvider } from "@hooks/useChatHosts";

export default function LessonClient({ lesson }: { lesson: ILesson }) {
  const refetchIntervalSeconds = 8;
  return (
    <ChatHostsProvider
      spec={lesson.spec}
      entity={"lesson"}
      updateIntervalSeconds={refetchIntervalSeconds}
    >
      <LessonDashboard lesson={lesson} />
    </ChatHostsProvider>
  );
}
