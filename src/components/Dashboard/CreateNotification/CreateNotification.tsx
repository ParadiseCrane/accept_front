"use client";
import { INewNotification } from "@custom-types/data/notification";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Button, CustomEditor, Helper, TextInput } from "@ui/basics";
import { requestWithNotify } from "@utils/requestWithNotify";
import { FC, memo, useCallback } from "react";

import styles from "./createNotification.module.css";
import { IListMessage } from "@custom-types/ui/IListMessage";
import { NotificationPreview } from "@components/Notification/Preview/NotificationPreview";

const CreateNotification: FC<{
  spec: string;
  type: string;
}> = ({ spec, type }) => {
  const { locale, lang } = useLocale();
  const { user } = useUser();

  const form = useForm({
    initialValues: {
      notificationTitle: "",
      notificationShortDescription: "",
      notificationDescription: "",
    },
    validate: {
      notificationTitle: (value) =>
        value.length < 5 ? locale.notification.form.validate.title : null,

      notificationShortDescription: (value) =>
        value.length == 0
          ? locale.notification.form.validate.shortDescription
          : null,
      notificationDescription: (value) =>
        value.length < 20
          ? locale.notification.form.validate.description
          : null,
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = useCallback(() => {
    if (!form.validate().hasErrors) {
      const notification: INewNotification = {
        spec: "",
        title: form.values.notificationTitle,
        shortDescription: form.values.notificationShortDescription,
        description: form.values.notificationDescription,
        logins: [],
        groups: [],
        roles: [],
        author: user?.login || "",
        broadcast: false,
      };

      requestWithNotify<INewNotification, string>(
        `${type}/add-notification/${spec}`,
        "POST",
        locale.notify.notification.create,
        lang,
        (_: string) => "",
        notification,
      );
    }
  }, [type, spec, form.values, user?.login, locale, lang]);

  const generatePreviewMessage = (): IListMessage => {
    return {
      spec: "",
      title: form.values.notificationTitle,
      author: user?.login ?? "",
      subject: form.values.notificationShortDescription,
      message: form.values.notificationDescription,
      date: new Date(Date.now()),
    };
  };

  return (
    <>
      <div className={styles.notificationWrapper}>
        <div className={styles.notificationLabel}>
          <div>{locale.notification.notification}</div>
          <Helper
            dropdownContent={locale.helpers.notification.assignmentCreation}
          />
        </div>
        <TextInput
          label={locale.notification.form.title}
          required
          {...form.getInputProps("notificationTitle")}
        />
        <TextInput
          label={locale.notification.form.shortDescription}
          helperContent={
            <div>
              {locale.helpers.notification.shortDescription.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          }
          required
          {...form.getInputProps("notificationShortDescription")}
        />
        <CustomEditor
          required
          helperContent={
            <div>
              {locale.helpers.notification.description.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          }
          label={locale.notification.form.description}
          form={form}
          name={"notificationDescription"}
        />
      </div>
      <Group align="center">
        <Button
          disabled={Object.keys(form.errors).length > 0}
          onClick={handleSubmit}
        >
          {locale.create}
        </Button>
        <NotificationPreview message={generatePreviewMessage()} />
      </Group>
    </>
  );
};

export default memo(CreateNotification);
