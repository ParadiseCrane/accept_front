import { FC, memo } from 'react';
import { Button, Pin } from '@ui/basics';
import { setter } from '@custom-types/ui/atomic';
import { ITournamentRegisterPayload } from '@custom-types/data/ITournament';
import { useLocale } from '@hooks/useLocale';
import styles from './enterPinCode.module.css';

const EnterPinCode: FC<{
  form: any;
  isTeam: boolean;
  handleRegistration: setter<ITournamentRegisterPayload>;
}> = ({ form, isTeam, handleRegistration }) => {
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
            pin:
              form.values.pin.length > 0
                ? form.values.pin
                : undefined,
            team_name:
              form.values.team_name.length > 0
                ? form.values.team_name
                : undefined,
          })
        }
      >
        {locale.tournament.register}
      </Button>
    </>
  );
};

export default memo(EnterPinCode);
