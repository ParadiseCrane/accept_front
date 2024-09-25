import { FC, memo } from 'react';
import { Menu } from '@mantine/core';
import { useUser } from '@hooks/useUser';
import { useLocale } from '@hooks/useLocale';
import { useBackNotifications } from '@hooks/useBackNotifications';
import { Indicator, UserAvatar } from '@ui/basics';
import styles from './profileMenu.module.css';
import { Logout } from 'tabler-icons-react';
import { accessLevels } from '@constants/protectedRoutes';
import { menuLinks } from '@constants/ProfileMenuLinks';
import Link from 'next/link';
import AccountsMenu from './AccountsMenu/AccountsMenu';

const ProfileMenu: FC<{}> = ({}) => {
  const { locale } = useLocale();
  const { user, signOut, accessLevel } = useUser();

  const { unviewed } = useBackNotifications();

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
            onClick={signOut}
            icon={<Logout color="var(--secondary)" size={20} />}
          >
            {locale.mainHeaderLinks.profileLinks.signOut}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <AccountsMenu />
    </div>
  );
};

export default memo(ProfileMenu);
