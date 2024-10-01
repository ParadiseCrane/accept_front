import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Menu } from '@mantine/core';
import { Icon, UserAvatar } from '@ui/basics';
import { FC, memo, useCallback } from 'react';
import styles from './accountsMenu.module.css';
import {
  errorNotification,
  newNotification,
  successNotification,
} from '@utils/notificationFunctions';
import { sendRequest } from '@requests/request';
import { clearCookie } from '@utils/cookies';
import { Logout, Plus, Trash } from 'tabler-icons-react';
import Link from 'next/link';

const AccountsMenu: FC<{}> = ({}) => {
  const { locale } = useLocale();
  const { user, signOut, accessLevel, accounts, refreshAccess } =
    useUser();

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
          {
            login,
            organization,
          }
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
          {
            login,
            organization,
          }
        ).then((res) => {
          if (!res.error) {
            clearCookie('user');
            clearCookie('accounts');
            refreshAccess();
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
    <Menu
      // opened={true}
      position="bottom-end"
      zIndex={999}
      transitionProps={{ transition: 'scale-y', duration: 150 }}
      openDelay={200}
      trigger="hover"
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
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 'var(--spacer-xs)',
                    width: '100%',
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
                </div>
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
          {'Выйти из аккаунта'}
          {/* TODO: Add locale */}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default memo(AccountsMenu);
