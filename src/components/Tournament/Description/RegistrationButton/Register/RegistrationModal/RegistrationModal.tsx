import { PIN_LENGTH } from '@constants/TournamentSecurity';
import { ITournamentRegisterPayload } from '@custom-types/data/ITournament';
import { pureCallback, setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Stepper } from '@mantine/core';
import { useForm } from '@mantine/form';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { FC, memo, useCallback, useEffect, useState } from 'react';

import CreateTeam from './pages/CreateTeam';
import EnterPinCode from './pages/EnterPinCode';
import IsCreate from './pages/IsCreate';
import styles from './registrationModal.module.css';

const RegistrationModal: FC<{
  opened: boolean;
  close: pureCallback;
  handleRegistration: setter<ITournamentRegisterPayload>;
  withPin: boolean;
  isTeam: boolean;
}> = ({ opened, close, withPin, isTeam, handleRegistration }) => {
  const { locale } = useLocale();
  const [isCreate, setIsCreate] = useState<boolean | undefined>(undefined);
  const [activePage, setActivePage] = useState(0);

  let form = useForm<{
    pin: string;
    team_name: string;
    withPin: boolean;
    isCreate: boolean | undefined;
  }>({
    initialValues: {
      pin: '',
      team_name: '',
      withPin: withPin,
      isCreate: isCreate,
    },
    validate: {
      pin: (value, values) =>
        !values.withPin && values.isCreate
          ? null
          : value.length < PIN_LENGTH
            ? locale.tournament.registration.form.validation.pin
            : null,
      team_name: (value, values) => {
        value = value.trim().replace(/\s+/, ' ');
        return !values.isCreate
          ? null
          : value.length == 0
            ? locale.tournament.registration.form.validation.teamName.empty
            : value.length < 4
              ? locale.tournament.registration.form.validation.teamName.minLength(
                  4
                )
              : value.length > 20
                ? locale.tournament.registration.form.validation.teamName.maxLength(
                    20
                  )
                : !value.match(/^[a-zA-Zа-яА-ЯЁё][a-zA-Zа-яА-ЯЁё_ ]+$/)
                  ? locale.tournament.registration.form.validation.teamName
                      .invalid
                  : null;
      },
    },
    validateInputOnChange: true,
  });

  useEffect(() => {
    form.setFieldValue('withPin', withPin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withPin]);

  useEffect(() => {
    form.setFieldValue('pin', '');
    form.setFieldValue('team_name', '');
    form.setFieldValue('isCreate', isCreate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreate]);

  const handleRegistrationValidationWrapper = useCallback(
    (payload: ITournamentRegisterPayload) => {
      if (form.validate().hasErrors) return;
      handleRegistration(payload);
    },
    [form, handleRegistration]
  );

  const onClose = useCallback(() => {
    setIsCreate(undefined);
    setActivePage(0);
    close();
  }, [close, setActivePage]);

  return (
    <SimpleModal
      opened={opened}
      close={onClose}
      title={locale.tournament.registration.label}
      classNames={{ body: styles.modalWrapper }}
      centered
      size="xl"
    >
      {isTeam ? (
        <Stepper
          active={activePage}
          onStepClick={setActivePage}
          classNames={{ content: styles.stepperContent }}
        >
          <Stepper.Step
            label={locale.tournament.registration.form.steps.labels[0]}
            description={
              locale.tournament.registration.form.steps.descriptions.isCreate
            }
            allowStepSelect
          >
            <IsCreate
              setIsCreate={(value: boolean) => {
                setIsCreate(value);
                setActivePage(1);
              }}
            />
          </Stepper.Step>
          {isCreate == undefined ? (
            <Stepper.Step
              label={locale.tournament.registration.form.steps.labels[1]}
              allowStepSelect={false}
            />
          ) : isCreate ? (
            <Stepper.Step
              label={locale.tournament.registration.form.steps.labels[1]}
              description={
                locale.tournament.registration.form.steps.descriptions
                  .createTeam
              }
            >
              <CreateTeam
                form={form}
                withPin={withPin}
                handleRegistration={handleRegistrationValidationWrapper}
              />
            </Stepper.Step>
          ) : (
            <Stepper.Step
              label={locale.tournament.registration.form.steps.labels[1]}
              description={
                locale.tournament.registration.form.steps.descriptions.joinTeam
              }
            >
              <EnterPinCode
                form={form}
                isTeam={isTeam}
                handleRegistration={handleRegistrationValidationWrapper}
                buttonText={locale.tournament.join}
              />
            </Stepper.Step>
          )}
        </Stepper>
      ) : (
        <div className={styles.stepperContent}>
          <EnterPinCode
            form={form}
            isTeam={isTeam}
            handleRegistration={handleRegistrationValidationWrapper}
            buttonText={locale.tournament.register}
          />
        </div>
      )}
    </SimpleModal>
  );
};

export default memo(RegistrationModal);
