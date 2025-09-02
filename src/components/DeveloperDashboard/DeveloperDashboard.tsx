'use client';
import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { useLocale } from '@hooks/useLocale';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import { FC, memo, useMemo } from 'react';
import {
  IconAtom,
  IconBellRinging,
  IconDeviceAnalytics,
  IconListDetails,
  IconTerminal,
  IconTestPipe,
  IconTestPipe2,
  IconUserExclamation,
} from '@tabler/icons-react';

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
        icon: <IconUserExclamation color="var(--secondary)" />,
        title: locale.dashboard.developer.feedbackList,
        section: 'feedback',
      },
      {
        page: <CurrentAttempts />,
        icon: <IconTestPipe color="var(--secondary)" />,
        title: locale.dashboard.developer.currentAttempts.title,
        section: 'current_attempts',
      },
      {
        page: <AllAttempts />,
        icon: <IconTestPipe2 color="var(--secondary)" />,
        title: locale.dashboard.developer.allAttempts,
        section: 'all_attempts',
      },
      {
        page: <NotificationList />,
        icon: <IconBellRinging color="var(--secondary)" />,
        title: locale.dashboard.developer.notificationList,
        section: 'notifications',
      },
      {
        page: <Organizations />,
        icon: <IconListDetails color="var(--secondary)" />,
        title: locale.dashboard.developer.organizationList,
        section: 'organizations',
      },
      {
        page: <Executor />,
        icon: <IconTerminal color="var(--secondary)" />,
        title: locale.dashboard.developer.executor,
        section: 'executor',
      },
      {
        page: <Analytics />,
        icon: <IconDeviceAnalytics color="var(--secondary)" />,
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
