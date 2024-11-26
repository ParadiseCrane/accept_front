import { useLocale } from '@hooks/useLocale';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { FC, memo, useCallback, useState } from 'react';
import MemberSelector from './MemberSelector/MemberSelector';
import styles from './initiateChatModal.module.css';
import { Button, TextArea } from '@ui/basics';
import { useForm } from '@mantine/form';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { sendRequest } from '@requests/request';
import { callback } from '@custom-types/ui/atomic';
import { IActivity } from '@custom-types/data/atomic';

const InitiateChatModal: FC<{
  exclude: string[];
  spec: string;
  entity: IActivity;
  onSuccess: callback<string>;
  small?: boolean;
}> = ({ exclude, spec, entity, onSuccess, small }) => {
  const { locale } = useLocale();
  const [startChatModal, setStartChatModal] = useState(false);
  const close = useCallback(() => setStartChatModal(false), []);

  const form = useForm({
    initialValues: {
      user: '',
      message: '',
    },
    validate: {
      user: (value) =>
        value ? null : locale.dashboard.chat.userModal.validation.user,
      message: (value) =>
        value.trim().length > 0
          ? null
          : locale.dashboard.chat.userModal.validation.message,
    },
    validateInputOnChange: true,
  });

  const handleSubmit = useCallback(() => {
    if (form.validate().hasErrors) {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.validationError,
        autoClose: 5000,
      });
      return;
    }
    sendRequest('chat', 'POST', {
      spec,
      entity,
      host: form.values.user,
      moderator: true,
      content: form.values.message,
    }).then((response) => {
      if (!response.error) {
        onSuccess(form.values.user);
        setStartChatModal(false);
        form.setFieldValue('message', '');
      } else {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.error,
          autoClose: 5000,
        });
      }
    });
  }, [entity, spec, form, locale, onSuccess]);

  return (
    <>
      <Button
        className={small ? styles.addHostButtonSmall : styles.addHostButton}
        variant="light"
        onClick={() => setStartChatModal(true)}
      >
        +
      </Button>
      <SimpleModal
        title={locale.dashboard.chat.userModal.send}
        opened={startChatModal}
        close={close}
      >
        <div className={styles.wrapper}>
          <MemberSelector
            entity={entity}
            spec={spec}
            opened={startChatModal}
            exclude={exclude}
            form={form}
            field={'user'}
          />
          <TextArea
            label={locale.dashboard.chat.userModal.message.label}
            placeholder={locale.dashboard.chat.userModal.message.placeholder}
            {...form.getInputProps('message')}
          />
          <SimpleButtonGroup
            actionButton={{
              label: locale.dashboard.chat.userModal.send,
              onClick: handleSubmit,
              props: {
                disabled: !form.isValid(),
              },
            }}
            cancelButton={{
              label: locale.cancel,
              onClick: close,
            }}
          />
        </div>
      </SimpleModal>
    </>
  );
};

export default memo(InitiateChatModal);
