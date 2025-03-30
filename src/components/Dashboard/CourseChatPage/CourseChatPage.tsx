import { FC, memo } from 'react';
import ChatPage from '../ChatPage/ChatPage';
import styles from './styles.module.css';
import { useLocale } from '@hooks/useLocale';

const CourseChatPage: FC<{ spec: string; groupSpec: string | null }> = ({
  spec,
  groupSpec,
}) => {
  const { locale } = useLocale();
  if (!groupSpec) {
    return <></>;
  }

  if (groupSpec === 'all') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.emptyMessageWrapper}>
          <div className={styles.emptyMessage}>
            <div>{locale.dashboard.course.chatNoGroupSelected}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ChatPage
      spec={spec}
      entity={'course'}
      customRequest={`course/participant/${spec}/${groupSpec}`}
      group_spec={groupSpec}
    />
  );
};

export default memo(CourseChatPage);
