import tableStyles from '@styles/ui/customTable.module.css';
import styles from './styles.module.css';
import { useClipboard } from '@mantine/hooks';
import {
  newNotification,
  successNotification,
} from '@utils/notificationFunctions';
import { useLocale } from '@hooks/useLocale';
import { FC } from 'react';

export const LinkCopy: FC<{ inviteSpec: string }> = ({ inviteSpec }) => {
  const clipboard = useClipboard({ timeout: 300 });
  const { locale } = useLocale();

  const onLinkClick = (toCopy: string) => {
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
  };

  return (
    <div className={tableStyles.titleWrapper}>
      <div
        className={`${tableStyles.link} ${styles.link_wrapper}`}
        onClick={() => {
          onLinkClick(
            `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${inviteSpec}`
          );
        }}
      >
        {`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${inviteSpec}`}
      </div>
    </div>
  );
};
