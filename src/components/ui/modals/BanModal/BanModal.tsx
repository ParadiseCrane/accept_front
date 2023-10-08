import { useForm } from '@mantine/form';
import { FC, memo, useCallback } from 'react';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { useLocale } from '@hooks/useLocale';
import { TextInput } from '@ui/basics';
import { callback } from '@custom-types/ui/atomic';
// import styles from './banModal.module.css'

const BanModal: FC<{ onAction: callback<string>; ban: boolean }> = ({
  onAction,
  ban,
}) => {
  const { locale } = useLocale();

  const form = useForm({
    initialValues: {
      banReason: '',
    },
    validate: {
      banReason: (value) =>
        value.length < 4 && ban
          ? locale.user.ban.form.validate.reason
          : null,
    },
    validateInputOnBlur: true,
  });

  const confirm = useCallback(() => {
    onAction(form.values.banReason);
  }, [form, onAction]);

  return (
    <ConfirmModal
      disabled={!form.isValid()}
      buttonText={ban ? locale.ban : locale.unban}
      kind={ban ? 'negative' : 'positive'}
      confirm={confirm}
      onClose={form.reset}
    >
      {ban && (
        <TextInput
          label={locale.attempt.banReason}
          {...form.getInputProps('banReason')}
        />
      )}
    </ConfirmModal>
  );
};

export default memo(BanModal);
