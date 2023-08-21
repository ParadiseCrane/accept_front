import { FC, memo, useCallback, useMemo, useState } from 'react';
import styles from '../registrationButton.module.css';
import { useLocale } from '@hooks/useLocale';
import { Helper } from '@ui/basics';
import { AlertCircle } from 'tabler-icons-react';
import { pureCallback } from '@custom-types/ui/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { Pin } from '@ui/basics';
import { PIN_LENGTH } from '@constants/TournamentSecurity';

const Register: FC<{
  spec: string;
  allowRegistrationAfterStart: boolean;
  onRegister: pureCallback;
  withPin?: boolean;
}> = ({ spec, allowRegistrationAfterStart, onRegister, withPin }) => {
  const { locale, lang } = useLocale();
  const [openedModal, setOpenedModal] = useState(false);
  const [pinCode, setPinCode] = useState('');

  const kind = useMemo(() => {
    return withPin ? 'close' : 'open';
  }, [withPin]);

  const handleRegistration = useCallback(() => {
    requestWithNotify<{ pin: string }, boolean>(
      `tournament/register/${kind}/${spec}`,
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
  }, [spec, kind, pinCode, onRegister, locale, lang]);

  const openModal = useCallback(() => setOpenedModal(true), []);
  const closeModal = useCallback(() => setOpenedModal(false), []);

  const onClick = useMemo(() => {
    return withPin ? openModal : handleRegistration;
  }, [withPin, openModal, handleRegistration]);

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
          size="xl"
        >
          <Pin
            value={pinCode}
            onChange={onInput}
            length={PIN_LENGTH}
            size={'xl'}
          />
          <SimpleButtonGroup
            actionButton={{
              label: locale.tournament.register,
              onClick: handleRegistration,
              props: { disabled: pinCode.length != PIN_LENGTH },
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
