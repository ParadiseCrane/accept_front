import Logo from '@components/layout/Navbar/Logo/Logo';
import SignIn from '@components/layout/Navbar/SignIn/SignIn';
import { AppShell, Burger, Group } from '@mantine/core';
import { FC, memo } from 'react';

const Header: FC<{ opened: boolean; toggle: () => void }> = ({
  opened,
  toggle,
}) => {
  return (
    <AppShell.Header p={'sm'}>
      <Group justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Logo size="sm" />
        </Group>
        <SignIn size="md" />
      </Group>
    </AppShell.Header>
  );
};

export default memo(Header);
