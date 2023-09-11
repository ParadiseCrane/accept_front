import { FC, memo, useCallback, useState } from 'react';
import { ILocale } from '@custom-types/ui/ILocale';
import { useLocale } from '@hooks/useLocale';
import styles from './registrationManagement.module.css';
import { UserSelector } from '@ui/selectors';
import { useRequest } from '@hooks/useRequest';
import { IUserDisplay } from '@custom-types/data/IUser';
import { Button, LoadingOverlay } from '@ui/basics';
import { Center } from '@mantine/core';
import { requestWithNotify } from '@utils/requestWithNotify';

const RegistrationManagement: FC<{ spec: string }> = ({ spec }) => {
  const { locale, lang } = useLocale();

  const [participants, setParticipants] = useState<
    string[] | undefined
  >(undefined);

  const { data, refetch, loading } = useRequest<
    {},
    { users: IUserDisplay[]; participants: string[] }
  >(
    `tournament/registration-management/${spec}`,
    'GET',
    undefined,
    (data) => {
      setParticipants(data.participants);
      return data;
    }
  );

  // useEffect(() => {
  //   console.log(participants);
  // }, [participants]);

  const handleRegister = useCallback(
    (logins: string[]) => {
      requestWithNotify<string[], {}>(
        `tournament/register-users/${spec}`,
        'POST',
        locale.notify.tournament.edit,
        lang,
        () => '',
        logins,
        () => refetch(false)
      );
    },
    [refetch, spec, locale, lang]
  );

  return (
    <div className={styles.wrapper}>
      {<LoadingOverlay visible={loading} />}
      {data && participants && (
        <>
          <UserSelector
            key={participants.toString()}
            users={data.users}
            initialUsers={participants}
            setFieldValue={setParticipants}
            titles={(locale: ILocale) => [
              locale.dashboard.tournament
                .registrationManagementSelector.users,
              locale.dashboard.tournament
                .registrationManagementSelector.participants,
            ]}
          />
          <Center style={{ margin: 'var(--spacer-xl) 0 0 0' }}>
            <Button onClick={() => handleRegister(participants)}>
              {locale.edit}
            </Button>
          </Center>
        </>
      )}
    </div>
  );
};

export default memo(RegistrationManagement);
