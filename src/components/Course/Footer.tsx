import { ActionIcon, AppShell, Group, Kbd } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { FC, memo } from 'react';
import { ArrowLeft, ArrowRight } from 'tabler-icons-react';

const Footer: FC<{ prev: () => void; next: () => void }> = ({ prev, next }) => {
  useHotkeys([
    ['ctrl + ,', () => prev()],
    ['ctrl + .', () => next()],
  ]);
  return (
    <AppShell.Footer>
      <Group justify="space-between" p={'md'} display={'flex'}>
        <ActionIcon onClick={() => prev()}>
          <ArrowLeft />
        </ActionIcon>
        <ActionIcon onClick={() => next()}>
          <ArrowRight />
        </ActionIcon>
      </Group>
    </AppShell.Footer>
  );
};

export default memo(Footer);
