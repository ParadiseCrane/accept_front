'use client';

import LessonDashboard from '@components/Dashboard/LessonDashboard';
import { ILesson } from '@custom-types/data/ICourse';
import { ChatHostsProvider } from '@hooks/useChatHosts';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import Title from '@ui/Title/Title';

export default function LessonClient({ lesson }: { lesson: ILesson }) {
  const refetchIntervalSeconds = 8;
  const { locale } = useLocale();
  const { user } = useUser();

  if (!user) return null;

  return (
    <>
      <Title title={locale.titles.dashboard.lesson} />
      <ChatHostsProvider
        spec={lesson.spec}
        entity={'lesson'}
        updateIntervalSeconds={refetchIntervalSeconds}
      >
        <LessonDashboard lesson={lesson} />
      </ChatHostsProvider>
    </>
  );
}
