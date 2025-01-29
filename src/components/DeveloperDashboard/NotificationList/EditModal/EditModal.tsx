import DescriptionInfo from '@components/Notification/Form/DescriptionInfo';
import MainInfo from '@components/Notification/Form/MainInfo';
import { INotificationWithRefs } from '@custom-types/data/notification';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { useForm } from '@mantine/form';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import Stepper from '@ui/Stepper/Stepper';
import { getLocalDate } from '@utils/datetime';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback } from 'react';

import styles from './editModal.module.css';

const stepFields = [
  ['title', 'author'],
  ['shortDescription', 'description'],
];

const EditModal: FC<{
  notification: INotificationWithRefs;
  opened: boolean;
  close: (_: boolean) => void;
}> = ({ notification, opened, close }) => {
  const { locale, lang } = useLocale();
  const { user } = useUser();

  const form = useForm({
    initialValues: {
      author: notification.author,
      title: notification.title,
      description: notification.description,
      shortDescription: notification.shortDescription,
    },
    validate: {
      title: (value) =>
        value.length < 5 ? locale.notification.form.validate.title : null,
      shortDescription: () => null,
      description: (value) =>
        value.length < 20
          ? locale.notification.form.validate.description
          : null,
    },
  });

  const handleEdit = useCallback(() => {
    if (form.validate().hasErrors) {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.validationError,
        autoClose: 5000,
      });
      return;
    }
    const body: INotificationWithRefs = {
      ...notification,
      ...form.values,
      author:
        form.values.author.length > 0 ? form.values.author : user?.login || '',
    };
    requestWithNotify<INotificationWithRefs, string>(
      'notification/dev/edit',
      'POST',
      locale.notify.notification.edit,
      lang,
      (_: string) => '',
      body,
      () => {
        setTimeout(() => close(true), 100);
      }
    );
  }, [form, notification, user?.login, locale, lang, close]);

  return (
    <SimpleModal
      opened={opened}
      close={() => close(false)}
      size={'80%'}
      hideCloseButton
      title={locale.notification.modals.update}
    >
      <div className={styles.content}>
        <div>
          <div>Spec: {notification.spec}</div>
          <div>Date: {getLocalDate(notification.date)}</div>
        </div>
        <Stepper
          buttonLabel={locale.edit}
          form={form}
          handleSubmit={handleEdit}
          stepFields={stepFields}
          noDefault={true}
          pages={[
            <MainInfo key="1" form={form} />,
            <DescriptionInfo key="2" form={form} />,
          ]}
          labels={locale.notification.form.steps.labels}
          descriptions={locale.notification.form.steps.descriptions}
        />
      </div>
    </SimpleModal>
  );
};

export default memo(EditModal);
