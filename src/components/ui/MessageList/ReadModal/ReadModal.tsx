import { Button, LoadingOverlay, Modal } from '@ui/basics';
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './readModal.module.css';
import { Group } from '@mantine/core';
import { useLocale } from '@hooks/useLocale';
import { getLocalDate } from '@utils/datetime';
import { IListMessage } from '@custom-types/ui/IListMessage';

const ReadModal: FC<{
  opened: boolean;
  messages: IListMessage[];
  defaultSelected?: number;
  notLoading?: boolean;
  close: (_: string[]) => void;
  loading: boolean;
}> = ({
  opened,
  messages,
  defaultSelected,
  notLoading,
  close,
  loading,
}) => {
  const { locale } = useLocale();
  const [current, setCurrent] = useState(
    defaultSelected ? defaultSelected : 0
  );

  const [_, setViewed] = useState<string[]>([]);

  useEffect(() => {
    setCurrent(defaultSelected || 0);
    setViewed([]);
  }, [defaultSelected]);

  const message = useMemo(
    () => messages[current],
    [messages, current]
  );

  useEffect(() => {
    if (messages[current])
      setViewed((viewed) => {
        viewed.push(messages[current].spec);
        return viewed;
      });
  }, [messages, current, setViewed]);

  const prevOne = useCallback(() => {
    setCurrent((current) => (current > 0 ? current - 1 : current));
  }, []);

  const nextOne = useCallback(() => {
    setCurrent((current) =>
      current < messages.length - 1 ? current + 1 : current
    );
  }, [messages]);

  const handleClose = useCallback(() => {
    setViewed((viewed) => {
      close(viewed);
      return [];
    });
  }, [close]);

  return (
    <div>
      <Modal
        opened={opened}
        onClose={handleClose}
        size="80%"
        overlayProps={{
          blur: 3,
        }}
        classNames={{
          root: styles.root,
          body: styles.body,
          title: styles.titleWrapper,
        }}
        title={
          <>
            {message ? (
              <div className={styles.wrapper}>
                <div className={styles.title}>
                  {message.title}
                  <span className={styles.paging}>
                    {current + 1}/{messages.length}
                  </span>
                </div>
                <div className={styles.author}>
                  {locale.notification.form.author}: {message.author}
                </div>
                <div className={styles.date}>
                  {getLocalDate(message.date)}
                </div>
              </div>
            ) : (
              <div className={styles.seeProfileWrapper}>
                {locale.notification.seeProfile.map((par, index) => (
                  <p key={index}>{par}</p>
                ))}
              </div>
            )}
          </>
        }
        withCloseButton={false}
      >
        <LoadingOverlay visible={!notLoading && loading} />
        {message && (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: message.message,
              }}
            />
          </>
        )}
        <Group position="center" mt="xl" pb="md">
          {!(current == 0) && (
            <Button variant="light" onClick={prevOne}>
              {locale.form.back}
            </Button>
          )}
          {!(current >= messages.length - 1) && (
            <Button onClick={nextOne} variant="light">
              {locale.form.next}
            </Button>
          )}
        </Group>
      </Modal>
    </div>
  );
};

export default memo(ReadModal);
