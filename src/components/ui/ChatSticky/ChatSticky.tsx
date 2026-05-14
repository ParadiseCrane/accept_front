"use client";
import { IActivity } from "@custom-types/data/atomic";
import { IChatMessage } from "@custom-types/data/IMessage";
import { useUser } from "@hooks/useUser";
import { Affix } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { Icon, Indicator } from "@ui/basics";
import Chat from "@ui/Chat/Chat";
import { FC, memo, useCallback, useState } from "react";
import { IconMessageCircle2 } from "@tabler/icons-react";

import styles from "./chatSticky.module.css";

const ChatSticky: FC<{
  spec: string;
  entity: IActivity;
  host: string;
  group_spec?: string;
}> = ({ spec, entity, host, group_spec }) => {
  const [showChat, setShowChat] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const { user } = useUser();

  const ref = useClickOutside(() => {
    if (showChat) setShowChat(false);
  });

  const indicateNew = useCallback(() => {
    if (!showChat) setHasNew(true);
  }, [showChat]);

  return (
    <Affix ref={ref} zIndex={200} className={styles.affixRoot}>
      <div
        className={styles.chatContainer}
        style={{ visibility: showChat ? "visible" : "hidden" }}
      >
        {typeof window !== "undefined" && (
          <Chat
            entity={entity}
            spec={spec}
            host={host}
            indicateNew={indicateNew}
            opened={showChat}
            isMessageMine={(message: IChatMessage) =>
              !!user && message.author == user?.login
            }
            wrapperStyles={styles.chatWrapper}
            group_spec={group_spec}
          />
        )}
      </div>

      <Icon
        onClick={() => {
          setShowChat((value) => !value);
          setHasNew(false);
        }}
        size={"xs"}
        className={styles.iconRoot}
        wrapperClassName={styles.iconWrapper}
      >
        <Indicator
          inline
          disabled={!hasNew}
          size={10}
          offset={0}
          zIndex={100}
          processing
          color="var(--accent)"
        >
          <IconMessageCircle2 color="white" />
        </Indicator>
      </Icon>
    </Affix>
  );
};

export default memo(ChatSticky);
