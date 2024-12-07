import { FC, memo, useEffect, useMemo } from 'react';
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
// attempt_info: IAttemptInfo;
// task_info: ITaskInfo
// rating_info: IRatingInfo | undefined

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
          section: 'create',
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
  const router = useRouter();

  const { locale } = useLocale();

  const { isTeacher } = useUser();

  // const links: IMenuLink[] = useMemo(() => {
  //   let globalLinks = [
  //     {
  //       page: (
  //         <ProfileInfo
  //           user={user}
  //           attempt_info={attempt_info}
  //           task_info={task_info}
  //           rating_info={rating_info}
  //         />
  //       ),
  //       icon: <Robot color="var(--secondary)" />,
  //       title: locale.profile.profile,
  //       section: 'profile',
  //     },
  //     {
  //       page: <NotificationList />,
  //       icon: (
  //         <Indicator disabled={unviewed <= 0} size={8}>
  //           <BellRinging color="var(--secondary)" />
  //         </Indicator>
  //       ),
  //       title: locale.profile.notification,
  //       section: 'notifications',
  //     },
  //     {
  //       page: <AssignmentList />,
  //       icon: <Chalkboard color="var(--secondary)" />,
  //       title: locale.profile.assignments,
  //       section: 'assignments',
  //     },
  //     {
  //       page: <AttemptListProfile />,
  //       icon: <AlignRight color="var(--secondary)" />,
  //       title: locale.profile.attempts,
  //       section: 'attempts',
  //     },
  //     {
  //       page: <Settings user={user} />,
  //       icon: <SettingsIcon color="var(--secondary)" />,
  //       title: locale.profile.settings,
  //       section: 'settings',
  //     },
  //   ];
  //   if (isTeacher) {
  //     globalLinks.splice(4, 0, {
  //       page: <CreateNotification />,
  //       icon: <BellPlus color="var(--secondary)" />,
  //       title: locale.profile.createNotification,
  //       section: 'create',
  //     });
  //   }
  //   return globalLinks;
  // }, [user, attempt_info, task_info, rating_info, locale, unviewed, isTeacher]);

  const links = getLinks({
    attempt_info: attempt_info,
    isTeacher: isTeacher,
    locale: locale,
    rating_info: rating_info,
    task_info: task_info,
    unviewed: unviewed,
    user: user,
  });

  console.log('links', links);

  const initialStep = useMemo(() => {
    let section = router.query.section as string;
    if (!section) return 0;
    let idx = links.findIndex((element) => element.section == section);
    return idx > 0 ? idx : 0;
  }, [links, router.query.section]);

  const changeParams = (section: string) => {
    // const section = links[idx].section ?? 'profile';
    const newPathObject = {
      pathname: router.pathname,
      query: { section: section },
    };
    router.push(newPathObject, undefined, { shallow: true });
  };

  useEffect(() => {
    const section = router.query.section as string;
    // changeParams(section);
  }, [isTeacher]);

  return (
    <LeftMenu
      links={links}
      initialStep={initialStep}
      changeParams={changeParams}
      router={router}
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
