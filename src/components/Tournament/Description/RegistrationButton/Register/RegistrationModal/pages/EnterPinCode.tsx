import { ITournamentRegisterPayload } from '@custom-types/data/ITournament';
import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Button, Pin } from '@ui/basics';
import { FC, memo } from 'react';

import styles from './enterPinCode.module.css';

const EnterPinCode: FC<{
  form: any;
  isTeam: boolean;
  handleRegistration: setter<ITournamentRegisterPayload>;
  buttonText: string;
}> = ({ form, isTeam, handleRegistration, buttonText }) => {
  const { locale } = useLocale();

  return (
    <>
      <div className={styles.label}>
        {isTeam
          ? locale.tournament.registration.enterPinCode.teamPin
          : locale.tournament.registration.enterPinCode.tournamentPin}
      </div>
      <Pin {...form.getInputProps('pin')} />
      <Button
        variant="outline"
        disabled={!form.isValid()}
        onClick={() =>
          handleRegistration({
            pin: form.values.pin.length > 0 ? form.values.pin : undefined,
            team_name:
              form.values.team_name.length > 0
                ? form.values.team_name
                : undefined,
          })
        }
      >
        {buttonText}
      </Button>
    </>
  );
};

export default memo(EnterPinCode);
