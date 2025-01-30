import { tooltipOpenDelay } from '@constants/Duration';
import { useLocale } from '@hooks/useLocale';
import { ActionIcon, Group, Kbd } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { Tip } from '@ui/basics';
import { FC, memo } from 'react';
import { ArrowLeft, ArrowRight } from 'tabler-icons-react';

const NavigationMenu: FC<{ prev: () => void; next: () => void }> = ({
  prev,
  next,
}) => {
  const { locale } = useLocale();
  useHotkeys([
    ['ctrl + ,', () => prev()],
    ['ctrl + .', () => next()],
  ]);
  return (
    <Group justify="space-between" p={'xs'} w={'100%'} display={'flex'}>
      <Tip
        label={
          <div>
            <Kbd>Ctrl</Kbd> + <Kbd>&lt;</Kbd>
          </div>
        }
        openDelay={tooltipOpenDelay}
      >
        <ActionIcon onClick={() => prev()} size={'sm'}>
          <ArrowLeft />
        </ActionIcon>
      </Tip>
      <Tip
        label={
          <div>
            <Kbd>Ctrl</Kbd> + <Kbd>&gt;</Kbd>
          </div>
        }
        openDelay={tooltipOpenDelay}
      >
        <ActionIcon onClick={() => next()} size={'sm'}>
          <ArrowRight />
        </ActionIcon>
      </Tip>
    </Group>
  );
};

export default memo(NavigationMenu);
