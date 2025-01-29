import { ITournamentRegisterPayload } from '@custom-types/data/ITournament';
import { pureCallback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Helper } from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, memo, useCallback, useMemo, useState } from 'react';
import { AlertCircle } from 'tabler-icons-react';

import styles from '../registrationButton.module.css';
import RegistrationModal from './RegistrationModal/RegistrationModal';

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
  const { authorized } = useUser();
  const router = useRouter();
  const [openedModal, setOpenedModal] = useState(false);

  const openModal = useCallback(() => setOpenedModal(true), []);
  const closeModal = useCallback(() => setOpenedModal(false), []);

  const handleRegistration = useCallback(
    (payload: ITournamentRegisterPayload) => {
      requestWithNotify<ITournamentRegisterPayload, boolean>(
        `tournament/register/${spec}`,
        'POST',
        locale.notify.tournament.registration,
        lang,
        () => '',
        payload,
        () => {
          location.reload();
          onRegistration();
        }
      );
    },
    [lang, locale, onRegistration, spec]
  );

  const isTeam = useMemo(() => maxTeamSize != 1, [maxTeamSize]);

  const handleClick = useCallback(() => {
    if (!isTeam && !withPin) {
      handleRegistration({ pin: undefined, team_name: undefined });
      return;
    }
    openModal();
  }, [handleRegistration, isTeam, openModal, withPin]);

  return (
    <>
      <RegistrationModal
        opened={openedModal}
        close={closeModal}
        withPin={withPin}
        isTeam={isTeam}
        handleRegistration={handleRegistration}
      />
      <div className={styles.registrationWrapper}>
        {authorized ? (
          <div onClick={handleClick} className={styles.register}>
            {locale.tournament.register}
          </div>
        ) : (
          <Link
            className={styles.register}
            href={`/signin?referrer=${encodeURIComponent(router.asPath)}`}
          >
            {locale.tournament.register}
          </Link>
        )}
        <Helper dropdownContent={locale.helpers.tournament.registration} />
        {!allowRegistrationAfterStart && (
          <Helper
            dropdownContent={locale.helpers.tournament.registrationWarning}
            customIcon={<AlertCircle color={'var(--negative)'} />}
          />
        )}
      </div>
    </>
  );
};

export default memo(Register);
