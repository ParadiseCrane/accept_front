import { IActivity } from '@custom-types/data/atomic';
import { IChatMessage } from '@custom-types/data/IMessage';
import { useLocale } from '@hooks/useLocale';
import { useLongPooling } from '@hooks/useLongPooling';
import { Textarea } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import { sendRequest } from '@requests/request';
import { Icon } from '@ui/basics';
import { getLocalDate } from '@utils/datetime';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Send } from 'tabler-icons-react';

import styles from './chat.module.css';

const Chat: FC<{
  indicateNew?: () => void;
  opened: boolean;
  isMessageMine: (_: IChatMessage) => boolean;
  spec: string;
  entity: IActivity;
  host: string;
  wrapperStyles: any;
  moderator?: boolean;
}> = ({
  indicateNew,
  opened,
  entity,
  spec,
  host,
  isMessageMine,
  wrapperStyles,
  moderator,
}) => {
  const { locale } = useLocale();
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [message, setMessage] = useState('');

  const textArea = useRef<HTMLTextAreaElement>(null);
  const messagesDiv = useRef<HTMLDivElement>(null!);
  const [firstFetchDone, setFirstFetchDone] = useState(false);
  const [newMessages, setNewMessages] = useState<string[]>([]);

  const refetchIntervalSeconds = 2;

  const appendMessages = useCallback((messages: IChatMessage[]) => {
    setMessages((oldMessages) => {
      if (oldMessages.length == 0) return messages;
      if (messages.length == 0) return oldMessages;
      if (oldMessages[oldMessages.length - 1].spec == messages[0].spec)
        return oldMessages;
      return [...oldMessages, ...messages];
    });
    setNewMessages((oldMessages) => [
      ...oldMessages,
      ...messages.map((item) => item.spec),
    ]);
    if (messages.length > 0)
      setTimeout(() => {
        if (messagesDiv.current)
          messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
      }, 100);
  }, []);

  const fetchMessages = useCallback(
    (skip: boolean) => {
      return sendRequest<{}, IChatMessage[]>(`chat/new/${skip}`, 'POST', {
        entity,
        spec,
        host,
        moderator: !!moderator,
      }).then((res) => {
        if (!res.error) {
          appendMessages(res.response);
          if (indicateNew && res.response.length > 0) indicateNew();
        }
      });
    },
    [entity, spec, host, moderator, appendMessages, indicateNew]
  );

  const handleSend = useCallback(() => {
    if (message.trim() === '') return;
    let localMessage = message;
    setMessage('');
    sendRequest<{}, IChatMessage>('chat', 'POST', {
      entity,
      spec,
      host,
      moderator: !!moderator,
      content: localMessage,
    }).then((res) => {
      if (!res.error) {
        appendMessages([res.response]);
      }
    });
  }, [entity, spec, host, moderator, message, appendMessages]);

  useEffect(() => {
    if (opened && newMessages.length > 0)
      sendRequest<{}, boolean>('/chat/viewed', 'POST', {
        specs: newMessages,
        entity,
        spec,
        moderator: !!moderator,
      }).then(() => setNewMessages([]));
  }, [opened, newMessages, entity, moderator, spec]);

  useEffect(() => {
    if (firstFetchDone || !opened) return;
    setFirstFetchDone(true);
    sendRequest<{}, IChatMessage[]>('chat/all', 'POST', {
      entity,
      spec,
      host,
      moderator: !!moderator,
    }).then((res) => {
      if (!res.error) {
        setMessages(res.response);
        setTimeout(() => {
          if (messagesDiv.current) {
            messagesDiv.current.style.scrollBehavior = 'auto';
            messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
            messagesDiv.current.style.scrollBehavior = 'smooth';
          }
        }, 100);
      }
    });
  }, [entity, host, moderator, opened, firstFetchDone, spec]);

  useLongPooling(fetchMessages, refetchIntervalSeconds);

  return (
    <div className={wrapperStyles}>
      <div ref={messagesDiv} className={styles.messages}>
        {messages.map((message, index) => (
          <div
            className={`${styles.messageWrapper} ${
              isMessageMine(message) ? styles.own : ''
            }`}
            key={index}
          >
            <div className={styles.message}>
              <div className={styles.user}>{message.author}</div>

              <div className={styles.content}>{message.content}</div>
              <div className={styles.date}>{getLocalDate(message.date)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.sendWrapper}>
        <Textarea
          className={styles.input}
          ref={textArea}
          styles={{
            root: {
              width: '100%',
              height: '100%',
              padding: 0,
            },
            wrapper: { height: '100%' },
            input: {
              height: '100%',
              border: 'none',
              fontSize: 'var(--font-size-s)',
            },
          }}
          classNames={{
            input: styles.textInput,
          }}
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
          placeholder={locale.placeholders.chat}
          onKeyDown={getHotkeyHandler([
            [
              'Shift+Enter',
              () => {
                setMessage((message) => message + '\n');
              },
            ],
            ['Enter', handleSend],
          ])}
          minRows={1}
          maxRows={3}
          autosize
        />
        <Icon
          className={styles.button}
          onClick={handleSend}
          size={'sm'}
          color="var(--primary)"
          wrapperClassName={styles.iconWrapper}
        >
          <Send />
        </Icon>
      </div>
    </div>
  );
};

export default memo(Chat);
