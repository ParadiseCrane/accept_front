import { INotificationWithRefs } from '@custom-types/data/notification';
import { setter } from '@custom-types/ui/atomic';
import { IListAction, IListMessage } from '@custom-types/ui/IListMessage';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { Badge } from '@mantine/core';
import { TextInput } from '@ui/basics';
import MessageList from '@ui/MessageList/MessageList';
import { requestWithError } from '@utils/requestWithError';
import { shrinkText } from '@utils/shrinkText';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Search, Trash } from 'tabler-icons-react';

import EditModal from './EditModal/EditModal';
import styles from './notificationList.module.css';

const NotificationList: FC<{}> = () => {
  const { locale, lang } = useLocale();
  const [search, setSearch] = useState('');
  const [displayedNotifications, setDisplayedNotifications] = useState<
    INotificationWithRefs[]
  >([]);

  const processNotifications = useCallback(
    (notifications: INotificationWithRefs[]) => {
      return notifications.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
    []
  );

  const { data, loading, refetch } = useRequest<{}, INotificationWithRefs[]>(
    'notification/dev/all',
    'GET',
    undefined,
    processNotifications
  );

  const handleSearch = useCallback(
    async (value: string) => {
      setSearch(value);
      if (!data) return;
      var list = [...data];
      const Fuse = (await import('fuse.js')).default;
      const fuse = new Fuse(list, {
        keys: ['title'],
        findAllMatches: true,
      });

      const searched =
        value == '' ? list : fuse.search(value).map((result) => result.item);
      setDisplayedNotifications(searched);
    },
    [data]
  );

  useEffect(() => {
    if (data) {
      handleSearch('');
    }
  }, [handleSearch, data]);

  const messages = useMemo(
    () =>
      (displayedNotifications || []).map(
        (item) =>
          ({
            ...item,
            spec: item.spec,
            author: item.author,
            date: item.date,
            message: item.description,
            subject: item.shortDescription,
            title: item.title,
          }) as IListMessage
      ),
    [displayedNotifications]
  );
  const [openedModal, setOpenedModal] = useState(false);
  const [editIndex, setEditIndex] = useState(0);

  const handleDelete = useCallback(
    (selected: string[], setSelected: setter<string[]>) => {
      requestWithError<string[], boolean>(
        'notification/dev/delete',
        'DELETE',
        locale.notification.list.requestDelete,
        lang,
        selected,
        () => {
          refetch();
          setSelected([]);
        }
      );
    },
    [lang, locale, refetch]
  );

  const disabledEdit = useCallback(
    (selected: string[]) => selected.length > 1,
    []
  );

  const handleEdit = useCallback(
    (selected: string[], setSelected: setter<string[]>) => {
      setOpenedModal(true);
      setEditIndex(data?.findIndex((item) => item.spec == selected[0]) || 0);
      setSelected([]);
    },
    [data]
  );

  const actions: IListAction[] = useMemo(
    () => [
      {
        icon: <Trash />,
        tooltipLabel: locale.notification.list.delete,
        onClick: handleDelete,
      },
      {
        icon: <Pencil />,
        tooltipLabel: locale.notification.list.edit,
        onClick: handleEdit,
        disabled: disabledEdit,
      },
    ],
    [handleDelete, locale, disabledEdit, handleEdit]
  );

  return (
    <div>
      <TextInput
        leftSection={<Search />}
        classNames={{
          input: styles.search,
        }}
        onChange={(e: any) => handleSearch(e.target.value)}
        placeholder={locale.placeholders.search}
        value={search}
      />
      <div>
        {data && data[editIndex] && (
          <EditModal
            key={editIndex}
            notification={data[editIndex]}
            opened={openedModal}
            close={(needRefetch: boolean) => {
              setOpenedModal(false);
              if (needRefetch) {
                refetch();
              }
            }}
          />
        )}
        <MessageList
          actions={actions}
          emptyMessage={locale.profile.empty.notification}
          loading={loading}
          messageTitle={(message: IListMessage) => {
            return (
              <>
                {shrinkText(message.title, 48)}
                {
                  //@ts-ignore
                  <Badge color="green">{message.references}</Badge>
                }
              </>
            );
          }}
          messages={messages}
          refetch={() => refetch(false)}
          handleViewed={() => {}}
          rowClassName={(_: IListMessage) => ''}
        />
      </div>
    </div>
  );
};

export default memo(NotificationList);
