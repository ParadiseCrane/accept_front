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

  const removeSession = useCallback(() => {
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
            clearCookie('user');
            clearCookie('accounts');
            refreshAccess();
            window.location.reload();
          }
        });
    },
    [refreshAccess]
  );

  const handleSignOut = useCallback(() => {
    if (accounts.length > 0 && user) {
      removeAccount(user.login, user.organization)();
      return;
    }
    removeSession();
  }, [accounts.length, removeAccount, removeSession, user]);

  return (
    <div className={styles.wrapper}>
      <Menu
        trigger="hover"
        zIndex={1000}
        transitionProps={{ transition: 'scale-y', duration: 150 }}
      >
        <Menu.Target>
          <div>
            <Indicator label={unviewed} disabled={unviewed <= 0}>
              <UserAvatar
                login={user?.login}
                alt={'User avatar'}
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
          <Menu.Item
            onClick={handleSignOut}
            icon={<Logout color="var(--secondary)" size={20} />}
          >
            {locale.mainHeaderLinks.profileLinks.signOut}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Menu
        opened={true}
        position="bottom-end"
        zIndex={999}
        transitionProps={{ transition: 'scale-y', duration: 150 }}
      >
        <Menu.Target>
          <div>
            <div className={styles.accounts}>
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
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label className={styles.label}>
            {'Управление аккаунтами'}
            {/* TODO: Add locale */}
          </Menu.Label>
          <Menu.Divider />

          {accounts.map((item, index) => (
            <div key={index}>
              <Menu.Item component="div">
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
              <Menu.Divider />
            </div>
          ))}

          <Menu.Item
            component={Link}
            href={'/add_account'}
            icon={<Plus color="var(--secondary)" size={20} />}
          >
            {'Добавить аккаунт'}
          </Menu.Item>
          <Menu.Divider />

          <Menu.Item
            onClick={removeSession}
            icon={<Logout color="var(--secondary)" size={20} />}
          >
            {'Выйти из всех аккаунтов'}
            {/* TODO: Add locale */}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default memo(ProfileMenu);
