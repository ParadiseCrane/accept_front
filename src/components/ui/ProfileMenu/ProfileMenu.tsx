import { FC, memo, useState } from 'react';
import { Menu } from '@mantine/core';
import { useUser } from '@hooks/useUser';
import { useLocale } from '@hooks/useLocale';
import { useBackNotifications } from '@hooks/useBackNotifications';
import { Indicator, UserAvatar } from '@ui/basics';
import styles from './profileMenu.module.css';
import { Logout, Plus } from 'tabler-icons-react';
import { accessLevels } from '@constants/protectedRoutes';
import { menuLinks } from '@constants/ProfileMenuLinks';
import Link from 'next/link';
import AccountsMenu from './AccountsMenu/AccountsMenu';
import ConfirmLogoutModal from '@ui/modals/ConfirmLogoutModal/ConfirmLogoutModal';

const ProfileMenu: FC<{}> = ({}) => {
  const { locale } = useLocale();
  // TODO переделать обратно на const после выполнения задачи
  let { user, signOut, accessLevel, accounts } = useUser();

  // accounts = [accounts[0]];
  // accounts = [...accounts, ...accounts, ...accounts];

  const { unviewed } = useBackNotifications();

  const [showMenu, toggleMenu] = useState<undefined | boolean>(
    undefined
  );

  return (
    <div className={styles.wrapper}>
      <Menu
        opened={showMenu}
        trigger="hover"
        zIndex={1000}
        transitionProps={{ transition: 'scale-y', duration: 150 }}
      >
        <Menu.Target>
          <div>
            <Indicator label={unviewed} disabled={unviewed <= 0}>
              <UserAvatar
                login={user?.login}
                organization={user?.organization}
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

          {/* TODO пока вставил сюда без локализации
              потом исправить и сделать нормально
              в каком порядке должны идти кнопки? 
              то есть после какой добавить кнопку "Добавить аккаунт"?
           */}
          <Menu.Item
            component={Link}
            href={'/add_account'}
            icon={<Plus color="var(--secondary)" size={20} />}
            style={{ display: accounts.length == 1 ? '' : 'none' }}
          >
            {'Добавить аккаунт'}
          </Menu.Item>

          <Menu.Divider />
          <ConfirmLogoutModal
            openMenu={() => {
              toggleMenu(true);
            }}
            closeMenu={() => {
              toggleMenu(undefined);
            }}
            confirm={signOut}
            // TODO добавить локализацию
            modalText="Вы уверены, что хотите завершить сессию?"
          >
            <Menu.Item
              icon={<Logout color="var(--secondary)" size={20} />}
            >
              {locale.mainHeaderLinks.profileLinks.signOut}
            </Menu.Item>
          </ConfirmLogoutModal>
        </Menu.Dropdown>
      </Menu>
      <AccountsMenu />
    </div>
  );
};

export default memo(ProfileMenu);
