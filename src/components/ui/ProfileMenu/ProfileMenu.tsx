import { FC, memo, useCallback, useEffect } from 'react';
import { Group, Menu } from '@mantine/core';
import { useUser } from '@hooks/useUser';
import { useLocale } from '@hooks/useLocale';
import {
  errorNotification,
  newNotification,
  successNotification,
} from '@utils/notificationFunctions';
import { useBackNotifications } from '@hooks/useBackNotifications';
import { Indicator, UserAvatar } from '@ui/basics';
import styles from './profileMenu.module.css';
import { Logout } from 'tabler-icons-react';
import { accessLevels } from '@constants/protectedRoutes';
import { menuLinks } from '@constants/ProfileMenuLinks';
import Link from 'next/link';

const ProfileMenu: FC<{}> = ({}) => {
  const { locale } = useLocale();
  const { user, signOut, accessLevel, accounts } = useUser();

  useEffect(() => {
    console.log(accounts);
  }, [accounts]);

  const { unviewed } = useBackNotifications();

  const handleSignOut = useCallback(() => {
    const id = newNotification({
      title: locale.notify.auth.signOut.loading,
      message: locale.loading + '...',
    });
    signOut().then((res) => {
      if (res) {
        successNotification({
          id,
          title: locale.notify.auth.signOut.success,
          autoClose: 5000,
        });
      } else {
        errorNotification({
          id,
          title: locale.notify.auth.signOut.error,
          autoClose: 5000,
        });
      }
    });
  }, [locale, signOut]);

  return (
    <>
      <Menu
        trigger="click"
        zIndex={1000}
        transitionProps={{ transition: 'scale-y', duration: 150 }}
      >
        <Menu.Target>
          <div>
            {/* TODO check is div needed */}
            <Indicator label={unviewed} disabled={unviewed <= 0}>
              <UserAvatar
                login={user?.login}
                alt={'Users avatar'}
                classNames={{ root: styles.avatar }}
              />
            </Indicator>
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label className={styles.label}>
            {user?.shortName || ''}
          </Menu.Label>
          {accounts.length > 0 && (
            <>
              <Menu.Divider />
              <Menu.Label className={styles.label}>
                {'Аккаунты'}
              </Menu.Label>

              {accounts.map((item, index) => (
                <Menu.Item
                  icon={
                    <UserAvatar
                      radius="md"
                      size="md"
                      login={item.user}
                      alt={'Users avatar'}
                    />
                  }
                >
                  {item.organization}
                </Menu.Item>
              ))}
            </>
          )}

          <Menu.Divider />
          <Menu.Label className={styles.label}>
            {'Полезное'}
          </Menu.Label>

          {menuLinks
            .filter(
              (item) =>
                !item.permission ||
                accessLevel >= accessLevels[item.permission]
            )
            .map((item, index) => (
              <Menu.Item
                component={Link}
                href={item.href}
                key={index}
                icon={item.icon}
              >
                {item.text(locale)}
              </Menu.Item>
            ))}
          <Menu.Divider />
          <Menu.Label className={styles.label}>
            {'Аккаунт'}
          </Menu.Label>

          <Menu.Item
            onClick={handleSignOut}
            icon={<Logout color="var(--secondary)" size={20} />}
          >
            {locale.mainHeaderLinks.profileLinks.signOut}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default memo(ProfileMenu);
