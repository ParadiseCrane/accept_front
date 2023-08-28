import { FC, memo, useCallback, useState } from 'react';
import { useLocale } from '@hooks/useLocale';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { pureCallback } from '@custom-types/ui/atomic';
import { useForm } from '@mantine/form';
import styles from './registrationModal.module.css';
import IsCreate from './pages/IsCreate';
import EnterPinCode from './pages/EnterPinCode';
import CreateTeam from './pages/CreateTeam';
import { Stepper } from '@mantine/core';

const RegistrationModal: FC<{
  spec: string;
  opened: boolean;
  close: pureCallback;
  onRegistration: pureCallback;
  withPin: boolean;
  maxTeamSize: number;
}> = ({
  spec,
  opened,
  close,
  onRegistration,
  withPin,
  maxTeamSize,
}) => {
  const { locale } = useLocale();
  const [isCreate, setIsCreate] = useState<boolean | undefined>(
    undefined
  );
  const [activePage, setActivePage] = useState(0);

  let form = useForm({
    initialValues: {
      pinCode: undefined,
      teamName: undefined,
    },
    validate: {
      pinCode: (value) =>
        !withPin && isCreate
          ? null
          : !!!value
          ? 'Введите пин-код'
          : null,
      teamName: (value) =>
        !isCreate
          ? null
          : !!!value
          ? 'Введите название команды'
          : null,
    },
  });

  const onClose = useCallback(() => {
    setIsCreate(undefined);
    close();
  }, [close]);

  return (
    <SimpleModal
      opened={opened}
      close={onClose}
      title={locale.tournament.enterPin}
      classNames={{ body: styles.modalWrapper }}
      centered
      size="xl"
    >
      {maxTeamSize != 1 ? (
        <Stepper active={activePage} onStepClick={setActivePage}>
          <Stepper.Step
            label="First step"
            description="Select is create"
            allowStepSelect
          >
            <IsCreate
              setIsCreate={(value: boolean) => {
                setIsCreate(value);
                setActivePage(1);
              }}
            />
          </Stepper.Step>
          {isCreate ? (
            <Stepper.Step
              label="Second step"
              description="Create team"
              allowStepSelect={!!isCreate}
            >
              <CreateTeam form={form} />
            </Stepper.Step>
          ) : (
            <Stepper.Step
              label="Second step"
              description="Join team"
              allowStepSelect={isCreate !== undefined && !isCreate}
            >
              <EnterPinCode form={form} isTeam={maxTeamSize != 1} />
            </Stepper.Step>
          )}
        </Stepper>
      ) : (
        <EnterPinCode form={form} isTeam={maxTeamSize != 1} />
      )}
    </SimpleModal>
  );
};

export default memo(RegistrationModal);
