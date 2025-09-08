'use client';
import tableStyles from '@styles/ui/customTable.module.css';
import styles from './styles.module.css';
import { useClipboard } from '@mantine/hooks';
import {
  newNotification,
  successNotification,
} from '@utils/notificationFunctions';
import { useLocale } from '@hooks/useLocale';
import { FC, useCallback, useState } from 'react';
import { sendRequest } from '@requests/request';
import { Icon, Tip } from '@ui/basics';
import { IconRefresh } from '@tabler/icons-react';
import { Skeleton } from '@mantine/core';

export const LinkCopy: FC<{
  inviteSpec: string;
  regenerateLink: () => Promise<string>;
}> = ({ inviteSpec, regenerateLink }) => {
  const [invite, setInvite] = useState(inviteSpec);
  const [loading, setLoading] = useState(false);
  const clipboard = useClipboard({ timeout: 300 });
  const { locale } = useLocale();

  const regenerateInvite = async () => {
    setLoading(true);
    const response = await regenerateLink();
    if (response.length !== 0) {
      setInvite(response);
    }
    setLoading(false);
  };

  const onLinkClick = useCallback(
    (toCopy: string) => {
      const id = newNotification({
        title: locale.loading,
        autoClose: false,
      });
      clipboard.copy(toCopy);
      successNotification({
        id,
        title: locale.notify.course.linkCopied,
        autoClose: 5000,
      });
    },
    [clipboard, locale]
  );

  return (
    <div
      className={`${tableStyles.titleWrapper} ${styles.link_with_refresh}`}
      style={{ flexWrap: 'nowrap' }}
    >
      <Tip label={locale.link.copyLink}>
        <Skeleton visible={loading}>
          <div
            className={`${tableStyles.link} ${styles.link_wrapper}`}
            onClick={() => {
              onLinkClick(
                `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invite}`
              );
            }}
          >
            {`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invite}`}
          </div>
        </Skeleton>
      </Tip>
      <div className={styles.refresh}>
        <Tip label={locale.link.refreshLink}>
          <Icon size="xs" onClick={regenerateInvite}>
            <IconRefresh />
          </Icon>
        </Tip>
      </div>
    </div>
  );
};
