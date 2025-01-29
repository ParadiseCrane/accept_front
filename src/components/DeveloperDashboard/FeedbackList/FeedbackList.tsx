import { IFeedbackMessage } from '@custom-types/data/IFeedbackMessage';
import { setter } from '@custom-types/ui/atomic';
import { IListAction, IListMessage } from '@custom-types/ui/IListMessage';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { Badge } from '@mantine/core';
import MessageList from '@ui/MessageList/MessageList';
import { requestWithError } from '@utils/requestWithError';
import { shrinkText } from '@utils/shrinkText';
import { FC, memo, useCallback, useMemo } from 'react';
import { MailOpened, Trash } from 'tabler-icons-react';

import styles from './feedbackList.module.css';

const FeedbackList: FC<{}> = () => {
  const { locale, lang } = useLocale();

  const processFeedbackMessages = useCallback(
    (messages: IFeedbackMessage[]) => {
      return messages.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
    []
  );

  const { data, loading, refetch } = useRequest<{}, IFeedbackMessage[]>(
    'feedback',
    'GET',
    undefined,
    processFeedbackMessages
  );

  const handleDelete = useCallback(
    (selected: string[], setSelected: setter<string[]>) => {
      requestWithError<string[], boolean>(
        'feedback/delete',
        'DELETE',
        locale.feedback.list.requestDelete,
        lang,
        selected,
        () => {
          setTimeout(refetch, 200);
          setSelected([]);
        }
      );
    },
    [locale, lang, refetch]
  );

  const sendViewed = useCallback(
    (viewed: string[], callback: () => void) => {
      requestWithError<string[], boolean>(
        'feedback/reviewed',
        'POST',
        locale.feedback.list.requestViewed,
        lang,
        viewed,
        callback
      );
    },
    [lang, locale]
  );

  const handleView = useCallback(
    (selected: string[], setSelected: setter<string[]>) => {
      sendViewed(selected, () => {
        setTimeout(refetch, 200);
        setSelected([]);
      });
    },
    [refetch, sendViewed]
  );

  const handleViewed = useCallback(
    (viewed: string[]) => {
      sendViewed(viewed, () => {
        setTimeout(refetch, 200);
      });
    },
    [sendViewed, refetch]
  );

  const messages = useMemo(
    () =>
      data
        ? data.map(
            (item) =>
              ({
                ...item,
                message: item.message,
                title: item.title,
              }) as IListMessage
          )
        : [],
    [data]
  );

  const actions: IListAction[] = useMemo(
    () => [
      {
        icon: <MailOpened />,
        tooltipLabel: locale.notification.list.viewed,
        onClick: handleView,
      },
      {
        icon: <Trash />,
        tooltipLabel: locale.notification.list.delete,
        onClick: handleDelete,
      },
    ],
    [
      handleDelete,
      handleView,
      locale.notification.list.delete,
      locale.notification.list.viewed,
    ]
  );

  return (
    <MessageList
      messages={messages}
      actions={actions}
      messageTitle={(feedback: IListMessage) => {
        return (
          <>
            {shrinkText(feedback.title, 48)}
            {
              //@ts-ignore
              !feedback.reviewed && <Badge color="green">{locale.new}</Badge>
            }
          </>
        );
      }}
      rowClassName={(feedback: IListMessage) =>
        //@ts-ignore
        feedback.reviewed ? styles.old : ''
      }
      refetch={refetch}
      emptyMessage={locale.profile.empty.notification}
      loading={loading}
      handleViewed={handleViewed}
    />
  );
};

export default memo(FeedbackList);
