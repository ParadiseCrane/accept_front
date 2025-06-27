import { FC, memo, useEffect, useState } from 'react';
import ChatPage from '../ChatPage/ChatPage';
import styles from './styles.module.css';
import { useLocale } from '@hooks/useLocale';
import { useSearchParams } from 'next/navigation';

const CourseChatPage: FC<{ spec: string; entity?: 'course' | 'lesson' }> = ({
  spec,
  entity = 'course',
}) => {
  const params = useSearchParams();
  const { locale } = useLocale();
  const [groupSpec, setGroupSpec] = useState<string | null>(null);

  useEffect(() => {
    if (params) {
      setGroupSpec(`${params.get('group')}`);
    }
  }, [params]);

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
      entity={entity}
      customRequest={`course/participant/${spec}/${groupSpec}`}
      group_spec={groupSpec}
    />
  );
};

export default memo(CourseChatPage);
