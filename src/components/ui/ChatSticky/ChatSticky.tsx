import { FC, memo, useCallback, useState } from 'react';
import styles from './chatSticky.module.css';
import { Affix } from '@mantine/core';
import { Icon, Indicator } from '@ui/basics';
import Chat from '@ui/Chat/Chat';
import { MessageCircle2 } from 'tabler-icons-react';
import { useClickOutside } from '@mantine/hooks';
import { IChatMessage } from '@custom-types/data/IMessage';
import { useUser } from '@hooks/useUser';

const ChatSticky: FC<{ spec: string; host: string }> = ({
  spec,
  host,
}) => {
  const [showChat, setShowChat] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const { user } = useUser();

  const ref = useClickOutside(() => setShowChat(false));

  const indicateNew = useCallback(() => {
    if (!showChat) setHasNew(true);
  }, [showChat]);

  return (
    <>
      <Affix
        ref={ref}
        position={{ bottom: 0, right: '200px' }}
        zIndex={201}
      >
        <div style={{ visibility: showChat ? 'visible' : 'hidden' }}>
          {window && (
            <Chat
              entity={spec}
              host={host}
              indicateNew={indicateNew}
              opened={showChat}
              isMessageMine={(message: IChatMessage) =>
                !!user && message.author == user?.login
              }
              wrapperStyles={styles.chatWrapper}
            />
          )}
        </div>
        <Icon
          onClick={() => {
            setShowChat((value) => !value);
            setHasNew(false);
          }}
          size={'xs'}
          className={styles.iconRoot}
          wrapperClassName={styles.iconWrapper}
        >
          <Indicator
            inline
            disabled={!hasNew}
            size={10}
            offset={0}
            zIndex={100}
            blink
          >
            <MessageCircle2 color="white" />
          </Indicator>
        </Icon>
      </Affix>
    </>
  );
};

export default memo(ChatSticky);
