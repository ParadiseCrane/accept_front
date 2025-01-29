import { tooltipOpenDelay } from '@constants/Duration';
import { useLocale } from '@hooks/useLocale';
import { ActionIcon, Group, Kbd, Tooltip } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { FC, memo } from 'react';
import { ArrowLeft, ArrowRight } from 'tabler-icons-react';

import styles from './styles.module.css';

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
    <Group justify="space-between" p={'md'} className={styles.nav_menu}>
      <Tooltip
        label={
          <div>
            {locale.course.prevShortcut}
            <Kbd>Ctrl</Kbd> + <Kbd>&lt;</Kbd>
          </div>
        }
        openDelay={tooltipOpenDelay}
      >
        <ActionIcon onClick={() => prev()}>
          <ArrowLeft />
        </ActionIcon>
      </Tooltip>
      <Tooltip
        label={
          <div>
            {locale.course.nextShortcut}
            <Kbd>Ctrl</Kbd> + <Kbd>&gt;</Kbd>
          </div>
        }
        openDelay={tooltipOpenDelay}
      >
        <ActionIcon onClick={() => next()}>
          <ArrowRight />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
};

export default memo(NavigationMenu);
