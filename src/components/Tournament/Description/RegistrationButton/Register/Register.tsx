import { FC, memo, useCallback, useState } from 'react';
import styles from '../registrationButton.module.css';
import { useLocale } from '@hooks/useLocale';
import { Helper } from '@ui/basics';
import { AlertCircle } from 'tabler-icons-react';
import { pureCallback } from '@custom-types/ui/atomic';
import RegistrationModal from './RegistrationModal/RegistrationModal';
import { requestWithNotify } from '@utils/requestWithNotify';

const Register: FC<{
  spec: string;
  allowRegistrationAfterStart: boolean;
  onRegistration: pureCallback;
  withPin: boolean;
  maxTeamSize: number;
}> = ({
  spec,
  allowRegistrationAfterStart,
  onRegistration,
  withPin,
  maxTeamSize,
}) => {
  const { locale, lang } = useLocale();
  const [openedModal, setOpenedModal] = useState(true);

  const openModal = useCallback(() => setOpenedModal(true), []);
  const closeModal = useCallback(() => setOpenedModal(false), []);

  const handleClick = useCallback(() => {
    if (maxTeamSize == 1 && !withPin) {
      requestWithNotify<undefined, boolean>(
        `tournament/register/open/${spec}`,
        'GET',
        locale.notify.tournament.registration,
        lang,
        () => '',
        undefined,
        () => {
          location.reload();
          onRegistration();
        }
      );
      return;
    }
    openModal();
  }, [
    lang,
    locale,
    maxTeamSize,
    onRegistration,
    openModal,
    spec,
    withPin,
  ]);

  return (
    <>
      <RegistrationModal
        spec={spec}
        opened={openedModal}
        close={closeModal}
        onRegistration={onRegistration}
        withPin={withPin}
        maxTeamSize={maxTeamSize}
      />
      <div className={styles.registrationWrapper}>
        <div onClick={handleClick} className={styles.register}>
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
