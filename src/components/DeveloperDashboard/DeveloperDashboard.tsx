import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { useLocale } from '@hooks/useLocale';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import { FC, memo, useMemo } from 'react';
import {
  Atom,
  BellRinging,
  DeviceAnalytics,
  ListDetails,
  Terminal,
  TestPipe,
  TestPipe2,
  UserExclamation,
} from 'tabler-icons-react';

import AllAttempts from './AllAttempts/AllAttempts';
import Analytics from './Analytics/Analytics';
import CurrentAttempts from './CurrentAttempts/CurrentAttempts';
import Executor from './Executor/Executor';
import FeedbackList from './FeedbackList/FeedbackList';
import NotificationList from './NotificationList/NotificationList';
import Organizations from './Organizations/Organizations';
// import styles from './developerDashboard.module.css'

const DeveloperDashboard: FC<{}> = () => {
  const { locale } = useLocale();

  const links: IMenuLink[] = useMemo(
    () => [
      {
        page: <FeedbackList />,
        icon: <UserExclamation color="var(--secondary)" />,
        title: locale.dashboard.developer.feedbackList,
        section: 'feedback',
      },
      {
        page: <CurrentAttempts />,
        icon: <TestPipe color="var(--secondary)" />,
        title: locale.dashboard.developer.currentAttempts.title,
        section: 'current_attempts',
      },
      {
        page: <AllAttempts />,
        icon: <TestPipe2 color="var(--secondary)" />,
        title: locale.dashboard.developer.allAttempts,
        section: 'all_attempts',
      },
      {
        page: <NotificationList />,
        icon: <BellRinging color="var(--secondary)" />,
        title: locale.dashboard.developer.notificationList,
        section: 'notifications',
      },
      {
        page: <Organizations />,
        icon: <ListDetails color="var(--secondary)" />,
        title: locale.dashboard.developer.organizationList,
        section: 'organizations',
      },
      {
        page: <Executor />,
        icon: <Terminal color="var(--secondary)" />,
        title: locale.dashboard.developer.executor,
        section: 'executor',
      },
      {
        page: <Analytics />,
        icon: <DeviceAnalytics color="var(--secondary)" />,
        title: locale.dashboard.developer.analytics.title,
        section: 'analytics',
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
