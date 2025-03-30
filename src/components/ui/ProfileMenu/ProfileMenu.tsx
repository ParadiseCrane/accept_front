import { menuLinks } from '@constants/ProfileMenuLinks';
import { accessLevels } from '@constants/protectedRoutes';
import { useBackNotifications } from '@hooks/useBackNotifications';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Menu } from '@mantine/core';
import { Indicator, UserAvatar } from '@ui/basics';
import ConfirmLogoutModal from '@ui/modals/ConfirmLogoutModal/ConfirmLogoutModal';
import { putOrganizationToLS } from '@utils/manageLocalStorage';
import Link from 'next/link';
import { FC, memo, useState } from 'react';
import { Logout, Plus } from 'tabler-icons-react';

import AccountsMenu from './AccountsMenu/AccountsMenu';
import styles from './profileMenu.module.css';

const ProfileMenu: FC<{ size: 'md' | 'lg' }> = ({ size }) => {
  const { locale } = useLocale();
  const { user, signOut, accessLevel, accounts } = useUser();

  const { unviewed } = useBackNotifications();

  const [showMenu, toggleMenu] = useState<undefined | boolean>(undefined);

  return (
    <div className={styles.wrapper}>
      <Menu
        opened={showMenu}
        trigger="hover"
        zIndex={100}
        transitionProps={{ transition: 'scale-y', duration: 150 }}
      >
        <Menu.Target>
          <div>
            <Indicator label={unviewed} disabled={unviewed <= 0}>
              <UserAvatar
                login={user?.login}
                size={size}
                radius={size}
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
                !item.permission || accessLevel >= accessLevels[item.permission]
            )
            .map((item, index) => (
              <Menu.Item
                component={Link}
                href={item.href}
                key={index}
                leftSection={item.icon}
              >
                {item.text(locale)}
              </Menu.Item>
            ))}

          <Menu.Item
            component={Link}
            href={'/add_account'}
            leftSection={<Plus color="var(--secondary)" size={20} />}
            style={{ display: accounts.length == 1 ? '' : 'none' }}
          >
            {locale.accounts.addAccount}
          </Menu.Item>

          <Menu.Divider />
          <ConfirmLogoutModal
            openMenu={() => {
              toggleMenu(true);
            }}
            closeMenu={() => {
              toggleMenu(undefined);
            }}
            confirm={() => {
              signOut();
              putOrganizationToLS({ value: user?.organization });
            }}
            title={locale.accounts.sessionLogout}
            modalText={locale.accounts.confirmSessionLogout}
          >
            <Menu.Item
              leftSection={<Logout color="var(--secondary)" size={20} />}
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
