"use client";

import { IListMessage } from "@custom-types/ui/IListMessage";
import { useLocale } from "@hooks/useLocale";
import { IconEye } from "@tabler/icons-react";
import { Button, Helper } from "@ui/basics";
import ReadModal from "@ui/MessageList/ReadModal/ReadModal";
import { FC, useState } from "react";
import styles from "./NotificationPreview.module.css";

interface Props {
  message: IListMessage;
}

export const NotificationPreview: FC<Props> = ({ message }) => {
  const { locale } = useLocale();
  const [openedModal, setOpenedModal] = useState(false);

  return (
    <>
      <div className={styles.wrapper}>
        <Button onClick={() => setOpenedModal(true)}>
          <IconEye size={20} style={{ marginRight: "4px" }} />
          {locale.notification.form.preview}
        </Button>
        <Helper dropdownContent={<>{locale.notification.form.previewHint}</>} />
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
