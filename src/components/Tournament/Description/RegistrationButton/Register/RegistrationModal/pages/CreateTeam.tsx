import { FC, memo } from 'react';
import { Button, Pin, TextInput } from '@ui/basics';
import { ITournamentRegisterPayload } from '@custom-types/data/ITournament';
import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
// import styles from './enterPinCode.module.css'

const CreateTeam: FC<{
  form: any;
  withPin: boolean;
  handleRegistration: setter<ITournamentRegisterPayload>;
}> = ({ form, withPin, handleRegistration }) => {
  const { locale } = useLocale();

  return (
    <>
      {withPin && (
        <Pin
          label={locale.tournament.registration.createTeam.pinLabel}
          {...form.getInputProps('pin')}
        />
      )}
      <TextInput
        label={
          locale.tournament.registration.createTeam.teamNameLabel
        }
        {...form.getInputProps('team_name')}
      />
      <Button
        variant="outline"
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
        disabled={!form.isValid()}
      >
        {locale.tournament.registration.createTeam.submitButton}
      </Button>
    </>
  );
};

export default memo(CreateTeam);
