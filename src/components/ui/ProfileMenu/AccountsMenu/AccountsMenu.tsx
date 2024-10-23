import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Avatar as MantineAvatar, Menu } from '@mantine/core';
import { Icon, Tip, UserAvatar } from '@ui/basics';
import { FC, memo, useCallback, useState } from 'react';
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
import ConfirmLogoutModal from '@ui/modals/ConfirmLogoutModal/ConfirmLogoutModal';
import UserLoginOrganization from './UserLoginOrganization/UserLoginOrganization';

const AccountsMenu: FC<{}> = ({}) => {
  const { locale } = useLocale();
  const { user, signOut, accessLevel, accounts, refreshAccess } = useUser();

  const filteredAccounts = accounts.filter(function (value) {
    if (
      !(value.login == user?.login && value.organization == user.organization)
    ) {
      return value;
    }
  });

  // boolean переменная, которая будет контролировать
  // отображать все три аватарки или 2 аватара +...остаток
  // то есть третий маленький аватар меняется на +1 / +2 и т.д.
  const showAccountsLeft: boolean = filteredAccounts.length > 3;

  // какое число отображать в кружочке после +
  const accountsLeftText =
    filteredAccounts.length - 2 > 9 ? `9+` : `+${filteredAccounts.length - 2}`;

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

  // вот здесь важный момент
  const [showMenu, toggleMenu] = useState<undefined | boolean>(undefined);

  return (
    <Menu
      opened={showMenu}
      position="bottom-end"
      zIndex={999}
      transitionProps={{ transition: 'scale-y', duration: 150 }}
      openDelay={200}
      trigger="hover"
    >
      <Menu.Target>
        <div>
          <div className={styles.accounts} id="accounts_menu_id">
            {accounts.length > 0 &&
              filteredAccounts
                .slice(
                  0,
                  Math.min(showAccountsLeft ? 2 : 3, filteredAccounts.length)
                )
                .map((item, index) => (
                  <UserAvatar
                    style={{
                      marginLeft: '-5px',
                      outline: '1px solid white',
                    }}
                    key={index}
                    login={item.login}
                    organization={item.organization}
                    size="sm"
                  />
                ))}
            {accounts.length > 3 ? (
              <MantineAvatar
                style={{
                  marginLeft: '-5px',
                  outline: '1px solid white',
                  color: 'var(--primary)',
                }}
                classNames={{ placeholder: styles.accounts_left }}
                radius="lg"
                size="sm"
                color="var(--primary)"
                variant="transparent"
              >
                {accountsLeftText}
              </MantineAvatar>
            ) : (
              <div style={{ display: 'none' }}></div>
            )}
          </div>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label className={styles.label}>
          {locale.accounts.manageAccounts}
        </Menu.Label>
        <Menu.Divider />

        <div className={styles.dropdown_account_list_wrapper}>
          {filteredAccounts.map((item, index) => (
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
                    onClick={changeAccount(item.login, item.organization)}
                  >
                    <UserAvatar
                      radius="md"
                      size="md"
                      login={item.login}
                      organization={item.organization}
                      alt={'Users avatar'}
                    />
                    <UserLoginOrganization
                      login={item.login}
                      organization={item.organization}
                    />
                  </div>
                  <Tip position="bottom" label={locale.accounts.logOut}>
                    <ConfirmLogoutModal
                      openMenu={() => {
                        toggleMenu(true);
                      }}
                      closeMenu={() => {
                        toggleMenu(undefined);
                      }}
                      confirm={removeAccount(item.login, item.organization)}
                      title={locale.accounts.confirmAction}
                      modalText={`${locale.accounts.confirmLogOut} ${item.login} (${item.organization})?`}
                    >
                      <Icon size="xs" className={styles.trash_icon}>
                        <Trash color="#00000060" />
                      </Icon>
                    </ConfirmLogoutModal>
                  </Tip>
                </div>
              </Menu.Item>
              <Menu.Divider
                // если элемент в списке последний, то мы не отображаем divider
                style={{
                  display: index == filteredAccounts.length - 1 ? 'none' : '',
                }}
              />
            </div>
          ))}
        </div>

        <Menu.Divider />
        <Menu.Item
          component={Link}
          href={'/add_account'}
          icon={<Plus color="var(--secondary)" size={20} />}
        >
          {locale.accounts.addAccount}
        </Menu.Item>
        <Menu.Divider />

        <Menu.Item
          onClick={removeSession}
          icon={<Logout color="var(--secondary)" size={20} />}
        >
          {locale.accounts.logOut}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default memo(AccountsMenu);
