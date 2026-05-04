"use client";

import { IListMessage } from "@custom-types/ui/IListMessage";
import { useLocale } from "@hooks/useLocale";
import { IconEye } from "@tabler/icons-react";
import { Button, Helper, Tip } from "@ui/basics";
import ReadModal from "@ui/MessageList/ReadModal/ReadModal";
import { FC, useState } from "react";
import styles from "./NotificationPreview.module.css";
import {
  infoNotification,
  newNotification,
} from "@utils/notificationFunctions";

interface Props {
  message: IListMessage;
  disabled?: boolean;
}

export const NotificationPreview: FC<Props> = ({
  message,
  disabled = false,
}) => {
  const { locale } = useLocale();
  const [openedModal, setOpenedModal] = useState(false);

  const displayNotification = () => {
    const id = newNotification({});
    infoNotification({
      id,
      backNotification: true,
      title: message.title,
      message: message.subject,
      onClick: (e: any) => {
        const isCloseButton = (e.target as HTMLElement).closest("button");
        if (isCloseButton) {
          return;
        }
        setOpenedModal(true);
      },
    });
  };

  return (
    <>
      <div className={styles.wrapper}>
        <Tip label={locale.notification.form.previewHint}>
          <Button
            onClick={displayNotification}
            disabled={disabled}
            variant="outline"
          >
            <IconEye size={20} style={{ marginRight: "4px" }} />
            {locale.notification.form.preview}
          </Button>
        </Tip>
      </div>
      <ReadModal
        opened={openedModal}
        messages={[message]}
        notLoading
        close={() => setOpenedModal(false)}
        loading={false}
        previewMode
      />
    </>
  );
};
