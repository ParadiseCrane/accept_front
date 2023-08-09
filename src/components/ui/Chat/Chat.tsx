import { Icon } from '@ui/basics';
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Send } from 'tabler-icons-react';
import styles from './chat.module.css';
import { IChatMessage } from '@custom-types/data/IMessage';
import { Textarea } from '@mantine/core';
import { useLocale } from '@hooks/useLocale';
import { getLocalDate } from '@utils/datetime';
import { sendRequest } from '@requests/request';
import { useRefetch } from '@hooks/useRefetch';

const Chat: FC<{
  indicateNew?: () => void;
  opened: boolean;
  isMessageMine: (_: IChatMessage) => boolean;
  entity: string;
  host: string;
  wrapperStyles: any;
  moderator?: boolean;
}> = ({
  indicateNew,
  opened,
  entity,
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
      console.log(oldMessages);
      console.log(messages);
      if (oldMessages.length == 0) return messages;
      if (messages.length == 0) return oldMessages;
      if (
        oldMessages[oldMessages.length - 1].spec == messages[0].spec
      )
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
          messagesDiv.current.scrollTop =
            messagesDiv.current.scrollHeight;
      }, 100);
  }, []);

  const fetchMessages = useCallback(
    (skip: boolean) => {
      return sendRequest<{}, IChatMessage[]>(
        `chat/new/${skip}`,
        'POST',
        {
          entity,
          host,
          moderator: !!moderator,
        }
      ).then((res) => {
        if (!res.error) {
          appendMessages(res.response);
          if (indicateNew && res.response.length > 0) indicateNew();
        }
      });
    },
    [entity, host, moderator, appendMessages, indicateNew]
  );

  useEffect(() => {
    fetchMessages(true);
  }, [fetchMessages]);

  const handleSend = useCallback(() => {
    if (message.trim() === '') return;
    sendRequest<{}, IChatMessage>('chat', 'POST', {
      entity,
      host,
      moderator: !!moderator,
      content: message,
    }).then((res) => {
      if (!res.error) {
        appendMessages([res.response]);
        setMessage('');
      }
    });
  }, [entity, host, moderator, message, appendMessages]);

  useEffect(() => {
    if (newMessages.length > 0)
      sendRequest<{}, boolean>('/chat/viewed', 'POST', {
        specs: newMessages,
        entity,
        moderator: !!moderator,
      }).then(() => setNewMessages([]));
  }, [opened, newMessages, entity, moderator]);

  useEffect(() => {
    if (firstFetchDone || !opened) return;
    setFirstFetchDone(true);
    sendRequest<{}, IChatMessage[]>('chat/all', 'POST', {
      entity,
      host,
      moderator: !!moderator,
    }).then((res) => {
      if (!res.error) {
        setMessages(res.response);
        setTimeout(() => {
          if (messagesDiv.current) {
            messagesDiv.current.style.scrollBehavior = 'auto';
            messagesDiv.current.scrollTop =
              messagesDiv.current.scrollHeight;
            messagesDiv.current.style.scrollBehavior = 'smooth';
          }
        }, 100);
      }
    });
  }, [entity, host, moderator, opened, firstFetchDone]);

  const fetchMessagesLong = useCallback(
    () => fetchMessages(false),
    [fetchMessages]
  );
  useRefetch(fetchMessagesLong, refetchIntervalSeconds);

  useEffect(() => {
    const handleClick = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    };
    const ref = textArea.current;
    if (ref) {
      ref.addEventListener('keydown', handleClick);
    }
    return () => {
      if (ref) ref.removeEventListener('keydown', handleClick);
    };
  }, [textArea, handleSend]);

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
              <div className={styles.date}>
                {getLocalDate(message.date)}
              </div>
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
