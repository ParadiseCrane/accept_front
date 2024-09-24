import { FC, memo, useCallback } from 'react';
import { Menu } from '@mantine/core';
import { useUser } from '@hooks/useUser';
import { useLocale } from '@hooks/useLocale';
import {
  errorNotification,
  newNotification,
  successNotification,
} from '@utils/notificationFunctions';
import { useBackNotifications } from '@hooks/useBackNotifications';
import { Icon, Indicator, UserAvatar } from '@ui/basics';
import styles from './profileMenu.module.css';
import { Logout, Plus, Trash } from 'tabler-icons-react';
import { accessLevels } from '@constants/protectedRoutes';
import { menuLinks } from '@constants/ProfileMenuLinks';
import Link from 'next/link';
import { sendRequest } from '@requests/request';
import { clearCookie } from '@utils/cookies';

const ProfileMenu: FC<{}> = ({}) => {
  const { locale } = useLocale();
  const { user, signOut, accessLevel, accounts, refreshAccess } =
    useUser();

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

  const changeAccount = useCallback(
    (login: string, organization: string) => {
      return () =>
        sendRequest<{ login: string; organization: string }, object>(
          '/auth/change_account',
          'POST',
          { login, organization }
        ).then((res) => {
          if (!res.error) {
            clearCookie('user');
            refreshAccess();
            window.location.reload();
          }
        });
    },
    [refreshAccess]
  );

  const removeAccount = useCallback(
    (login: string, organization: string) => {
      return () =>
        sendRequest<{ login: string; organization: string }, object>(
          '/auth/remove_account',
          'PUT',
          { login, organization }
        ).then((res) => {
          if (!res.error) {
            clearCookie('accounts');
            refreshAccess();
          }
        });
    },
    [refreshAccess]
  );

  return (
    <div className={styles.wrapper}>
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

          {accounts.length > 0 && (
            <>
              <Menu.Divider />
              <Menu.Label className={styles.label}>
                {'Аккаунты'}
              </Menu.Label>

              {accounts.map((item, index) => (
                <Menu.Item key={index} component="div">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      style={{
                        border: 'none',
                        background: 'none',
                        color: 'inherit',
                        padding: 0,
                        font: 'inherit',
                        outline: 'inherit',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 'var(--spacer-xs)',
                      }}
                      onClick={changeAccount(
                        item.login,
                        item.organization
                      )}
                    >
                      <UserAvatar
                        radius="md"
                        size="md"
                        login={item.login}
                        alt={'Users avatar'}
                      />
                      {item.organization}
                    </button>
                    <Icon
                      size="xs"
                      onClick={removeAccount(
                        item.login,
                        item.organization
                      )}
                    >
                      <Trash color="#00000060" />
                    </Icon>
                  </div>
                </Menu.Item>
              ))}
            </>
          )}

          <Menu.Divider />
          <Menu.Label className={styles.label}>
            {'Аккаунт'}
          </Menu.Label>

          <Menu.Item
            component={Link}
            href={'/add_account'}
            icon={<Plus color="var(--secondary)" size={20} />}
          >
            {'Добавить аккаунт'}
          </Menu.Item>

          <Menu.Item
            onClick={handleSignOut}
            icon={<Logout color="var(--secondary)" size={20} />}
          >
            {locale.mainHeaderLinks.profileLinks.signOut}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {accounts.length > 0 &&
        accounts
          .slice(0, Math.min(2, accounts.length))
          .map((item, index) => (
            <UserAvatar
              style={{
                marginLeft: '-5px',
                outline: '1px solid white',
              }}
              key={index}
              login={item.login}
              size="sm"
            />
          ))}
    </div>
  );
};

export default memo(ProfileMenu);
