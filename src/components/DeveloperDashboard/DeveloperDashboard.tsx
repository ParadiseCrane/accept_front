import { useLocale } from '@hooks/useLocale';
import { FC, memo, useMemo } from 'react';
import {
  BellRinging,
  DeviceAnalytics,
  Terminal,
  TestPipe,
  TestPipe2,
  UserExclamation,
} from 'tabler-icons-react';
import FeedbackList from './FeedbackList/FeedbackList';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import { IMenuLink } from '@custom-types/ui/IMenuLink';
import NotificationList from './NotificationList/NotificationList';
import Executor from './Executor/Executor';
import CurrentAttempts from './CurrentAttempts/CurrentAttempts';
import Analytics from './Analytics/Analytics';
import AllAttempts from './AllAttempts/AllAttempts';
// import styles from './developerDashboard.module.css'

const DeveloperDashboard: FC<{}> = ({}) => {
  const { locale } = useLocale();

  const links: IMenuLink[] = useMemo(
    () => [
      {
        page: <FeedbackList />,
        icon: <UserExclamation color="var(--secondary)" />,
        title: locale.dashboard.developer.feedbackList,
      },
      {
        page: <CurrentAttempts />,
        icon: <TestPipe color="var(--secondary)" />,
        title: locale.dashboard.developer.currentAttempts.title,
      },
      {
        page: <AllAttempts />,
        icon: <TestPipe2 color="var(--secondary)" />,
        title: locale.dashboard.developer.allAttempts,
      },
      {
        page: <NotificationList />,
        icon: <BellRinging color="var(--secondary)" />,
        title: locale.dashboard.developer.notificationList,
      },
      {
        page: <Executor />,
        icon: <Terminal color="var(--secondary)" />,
        title: locale.dashboard.developer.executor,
      },
      {
        page: <Analytics />,
        icon: <DeviceAnalytics color="var(--secondary)" />,
        title: locale.dashboard.developer.analytics.title,
      },
    ],
    [locale]
  );
  return (
    <>
      <LeftMenu links={links} />
    </>
  );
};

export default memo(DeveloperDashboard);
