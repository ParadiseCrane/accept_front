import { INotification } from '@custom-types/data/notification';
import { sendRequest } from '@requests/request';
import {
  infoNotification,
  newNotification,
} from '@utils/notificationFunctions';

import { requestWithError } from '@utils/requestWithError';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocale } from './useLocale';
import { useUser } from './useUser';
import { useRefetch } from './useRefetch';

interface INotificationContext {
  unviewed: number;
  sendViewed: (
    _: string[],
    __: { error: string; loading: string },
    ___: () => void
  ) => void;
  loading: boolean;
  refetchNewNotifications: () => void;
}

const BackNotificationsContext = createContext<INotificationContext>(
  null!
);

export const BackNotificationsProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { lang } = useLocale();
  const [unviewed, setUnviewed] = useState<number>(0);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(
    (use_long_pooling: boolean) => {
      if (!!!user || loading) return new Promise(() => {});
      setLoading(true);
      return sendRequest<
        undefined,
        { unviewed: number; hasNew: boolean }
      >(`notification/new-info/${!use_long_pooling}`, 'GET').then(
        (res) => {
          if (!res.error) {
            setUnviewed(res.response.unviewed);
            if (res.response.hasNew) {
              sendRequest<undefined, INotification[]>(
                'notification/new',
                'GET'
              ).then((res) => {
                if (!res.error) {
                  res.response.map((notification) => {
                    const id = newNotification({});
                    infoNotification({
                      id,
                      title: notification.title,
                      message: notification.shortDescription,
                    });
                  });
                }
              });
            }
          }
          setLoading(false);
        }
      );
    },
    [user]
  );

  useEffect(() => {
    if (!!!user) return;
    fetchNotifications(false);
  }, [user]); //eslint-disable-line

  const { loading: fetching } = useRefetch(
    () => fetchNotifications(true),
    2
  );

  const sendViewed = useCallback(
    (
      viewed: string[],
      messages: { error: string; loading: string },
      onSuccess: () => void
    ) => {
      if (viewed.length > 0) {
        requestWithError<string[], boolean>(
          'notification/viewed',
          'POST',
          messages,
          lang,
          Array.from(new Set(viewed)),
          () => {
            setTimeout(fetchNotifications, 500);
            onSuccess();
          }
        );
      }
    },
    [fetchNotifications, lang]
  );

  const value: INotificationContext = useMemo(
    () => ({
      unviewed,
      sendViewed,
      loading: fetching,
      refetchNewNotifications: () => fetchNotifications(true),
    }),
    [unviewed, sendViewed, fetching, fetchNotifications]
  );

  return (
    <BackNotificationsContext.Provider value={value}>
      {children}
    </BackNotificationsContext.Provider>
  );
};

export function useBackNotifications() {
  return useContext(BackNotificationsContext);
}
