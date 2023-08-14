import { FC, memo, useCallback, useMemo, useState } from 'react';
import styles from '../registrationButton.module.css';
import { useLocale } from '@hooks/useLocale';
import { Helper } from '@ui/basics';
import { AlertCircle } from 'tabler-icons-react';
import { pureCallback } from '@custom-types/ui/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { PinInput } from '@mantine/core';

const Register: FC<{
  spec: string;
  allowRegistrationAfterStart: boolean;
  onRegister: pureCallback;
  withPin?: boolean;
}> = ({ spec, allowRegistrationAfterStart, onRegister, withPin }) => {
  const { locale, lang } = useLocale();
  const [openedModal, setOpenedModal] = useState(false);
  const [pinCode, setPinCode] = useState('');

  const handleRegistration = useCallback(() => {
    requestWithNotify<{ pin: string }, boolean>(
      `tournament/register/${spec}`,
      'POST',
      locale.notify.tournament.registration,
      lang,
      () => '',
      { pin: pinCode },
      () => {
        location.reload();
        onRegister();
      }
    );
  }, [spec, locale.notify.tournament.registration, lang, onRegister]);

  const openModal = useCallback(() => setOpenedModal(true), []);
  const closeModal = useCallback(() => setOpenedModal(false), []);

  const onClick = useMemo(() => {
    return withPin ? openModal : handleRegistration;
  }, [withPin]);

  const onInput = useCallback((e: string) => setPinCode(e), []);

  return (
    <>
      {withPin && (
        <SimpleModal
          opened={openedModal}
          close={closeModal}
          title={locale.tournament.enterPin}
          classNames={{ body: styles.modalWrapper }}
          centered
        >
          <PinInput value={pinCode} onChange={onInput} />
          <SimpleButtonGroup
            actionButton={{
              label: locale.tournament.register,
              onClick: handleRegistration,
            }}
            cancelButton={{
              label: locale.cancel,
              onClick: closeModal,
            }}
          />
        </SimpleModal>
      )}
      <div className={styles.registrationWrapper}>
        <div onClick={onClick} className={styles.register}>
          {locale.tournament.register}
        </div>
        <Helper
          dropdownContent={locale.helpers.tournament.registration}
        />
        {!allowRegistrationAfterStart && (
          <Helper
            dropdownContent={
              locale.helpers.tournament.registrationWarning
            }
            customIcon={<AlertCircle color={'var(--negative)'} />}
          />
        )}
      </div>
    </>
  );
};

export default memo(Register);
