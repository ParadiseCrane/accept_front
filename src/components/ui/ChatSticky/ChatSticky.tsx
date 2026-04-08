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

  const refMobile = useClickOutside(() => {
    const { height } = refMobile.current.getBoundingClientRect();
    if (height) {
      setShowChat(false);
    }
  });
  const ref = useClickOutside(() => {
    const { height } = ref.current.getBoundingClientRect();
    if (height) {
      setShowChat(false);
    }
  });

  const indicateNew = useCallback(() => {
    if (!showChat) setHasNew(true);
  }, [showChat]);

  return (
    <>
      <Affix
        ref={refMobile}
        position={{ bottom: 50, left: 0 }}
        zIndex={200}
        className={styles.affixMobile}
      >
        <div style={{ visibility: showChat ? "visible" : "hidden" }}>
          {window && (
            <Chat
              entity={entity}
              spec={spec}
              host={host}
              indicateNew={indicateNew}
              opened={showChat}
              isMessageMine={(message: IChatMessage) =>
                !!user && message.author == user?.login
              }
              wrapperStyles={styles.chatWrapperMobile}
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
          className={styles.iconRootMobile}
          wrapperClassName={styles.iconWrapperMobile}
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
      <Affix
        ref={ref}
        position={{ bottom: 0, right: "200px" }}
        zIndex={100}
        className={styles.affix}
      >
        <div style={{ visibility: showChat ? "visible" : "hidden" }}>
          {window && (
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
    </>
  );
};

export default memo(ChatSticky);
