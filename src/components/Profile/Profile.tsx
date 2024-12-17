import { FC, memo, useEffect, useMemo, useState } from 'react';
import ProfileInfo from '@components/Profile/ProfileInfo/ProfileInfo';
import AttemptListProfile from '@components/Profile/AttemptListProfile/AttemptListProfile';
import {
  AlignRight,
  BellPlus,
  BellRinging,
  Chalkboard,
  Robot,
  Settings as SettingsIcon,
} from 'tabler-icons-react';
import { useLocale } from '@hooks/useLocale';
import NotificationList from '@components/Notification/List/NotificationList';
import { useBackNotifications } from '@hooks/useBackNotifications';
import { Indicator, UserAvatar } from '@ui/basics';
import styles from './profile.module.css';
import Settings from '@components/Profile/Settings/Settings';
import AssignmentList from '@components/Profile/AssignmentList/AssignmentList';
import CreateNotification from '@components/Profile/CreateNotification/CreateNotification';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { useUser } from '@hooks/useUser';
import { useRouter } from 'next/router';
import {
  IAttemptInfo,
  IFullProfileBundle,
  IRatingInfo,
  ITaskInfo,
} from '@custom-types/data/IProfileInfo';
import { IUser } from '@custom-types/data/IUser';

const getLinks = ({
  user,
  attempt_info,
  task_info,
  rating_info,
  isTeacher,
  locale,
  unviewed,
}: {
  user: IUser;
  attempt_info: IAttemptInfo;
  task_info: ITaskInfo;
  rating_info: IRatingInfo | undefined;
  isTeacher: boolean;
  locale: any;
  unviewed: number;
}) => {
  const links: IMenuLink[] = isTeacher
    ? [
        {
          page: (
            <ProfileInfo
              user={user}
              attempt_info={attempt_info}
              task_info={task_info}
              rating_info={rating_info}
            />
          ),
          icon: <Robot color="var(--secondary)" />,
          title: locale.profile.profile,
          section: 'profile',
        },
        {
          page: <NotificationList />,
          icon: (
            <Indicator disabled={unviewed <= 0} size={8}>
              <BellRinging color="var(--secondary)" />
            </Indicator>
          ),
          title: locale.profile.notification,
          section: 'notifications',
        },
        {
          page: <AssignmentList />,
          icon: <Chalkboard color="var(--secondary)" />,
          title: locale.profile.assignments,
          section: 'assignments',
        },
        {
          page: <AttemptListProfile />,
          icon: <AlignRight color="var(--secondary)" />,
          title: locale.profile.attempts,
          section: 'attempts',
        },
        {
          page: <CreateNotification />,
          icon: <BellPlus color="var(--secondary)" />,
          title: locale.profile.createNotification,
          section: 'create_notification',
        },
        {
          page: <Settings user={user} />,
          icon: <SettingsIcon color="var(--secondary)" />,
          title: locale.profile.settings,
          section: 'settings',
        },
      ]
    : [
        {
          page: (
            <ProfileInfo
              user={user}
              attempt_info={attempt_info}
              task_info={task_info}
              rating_info={rating_info}
            />
          ),
          icon: <Robot color="var(--secondary)" />,
          title: locale.profile.profile,
          section: 'profile',
        },
        {
          page: <NotificationList />,
          icon: (
            <Indicator disabled={unviewed <= 0} size={8}>
              <BellRinging color="var(--secondary)" />
            </Indicator>
          ),
          title: locale.profile.notification,
          section: 'notifications',
        },
        {
          page: <AssignmentList />,
          icon: <Chalkboard color="var(--secondary)" />,
          title: locale.profile.assignments,
          section: 'assignments',
        },
        {
          page: <AttemptListProfile />,
          icon: <AlignRight color="var(--secondary)" />,
          title: locale.profile.attempts,
          section: 'attempts',
        },
        {
          page: <Settings user={user} />,
          icon: <SettingsIcon color="var(--secondary)" />,
          title: locale.profile.settings,
          section: 'settings',
        },
      ];
  return links;
};

const Profile: FC<IFullProfileBundle> = ({
  user,
  attempt_info,
  task_info,
  rating_info,
}) => {
  const { unviewed } = useBackNotifications();

  const { locale } = useLocale();

  const { isTeacher } = useUser();

  const links = getLinks({
    attempt_info: attempt_info,
    isTeacher: isTeacher,
    locale: locale,
    rating_info: rating_info,
    task_info: task_info,
    unviewed: unviewed,
    user: user,
  });

  return (
    <LeftMenu
      links={links}
      topContent={
        <div className={styles.header}>
          <UserAvatar login={user.login} />
          <div className={styles.shortInfo}>
            <div className={styles.shortName}>{user.shortName}</div>
            <div className={styles.login}>{user.login}</div>
          </div>
        </div>
      }
    />
  );
};

export default memo(Profile);
