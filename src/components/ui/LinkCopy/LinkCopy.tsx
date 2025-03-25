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

export const LinkCopy: FC<{
  inviteSpec: string;
  regenerateLink: () => Promise<string>;
}> = ({ inviteSpec, regenerateLink }) => {
  const [invite, setInvite] = useState(inviteSpec);
  const clipboard = useClipboard({ timeout: 300 });
  const { locale } = useLocale();

  const regenerateInvite = async () => {
    const response = await regenerateLink();
    console.log('response', response);
    if (response.length !== 0) {
      setInvite(response);
    }
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
    [invite]
  );

  return (
    <div className={`${tableStyles.titleWrapper} ${styles.link_with_refresh}`}>
      <Tip label={locale.link.copyLink}>
        <div
          className={`${tableStyles.link} ${styles.link_wrapper}`}
          onClick={() => {
            onLinkClick(`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invite}`);
          }}
        >
          {`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invite}`}
        </div>
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
