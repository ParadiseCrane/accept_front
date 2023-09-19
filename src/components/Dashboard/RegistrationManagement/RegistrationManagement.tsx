import { FC, memo, useMemo } from 'react';
import styles from './registrationManagement.module.css';
import { useRequest } from '@hooks/useRequest';
import { IUserDisplay } from '@custom-types/data/IUser';
import Solo from './Solo/Solo';
import Team from './Team/Team';

const RegistrationManagement: FC<{
  spec: string;
  maxTeamSize: number;
}> = ({ spec, maxTeamSize }) => {
  const { data, refetch, loading } = useRequest<
    {},
    { users: IUserDisplay[]; participants: string[] }
  >(`tournament/registration-management/${spec}`, 'GET');

  const users = useMemo(() => (data ? [...data?.users] : []), [data]);
  const participants = useMemo(
    () => (data ? [...data?.participants] : []),
    [data]
  );

  return (
    <div className={styles.wrapper}>
      {maxTeamSize == 1 ? (
        <Solo
          spec={spec}
          refetch={refetch}
          initialParticipants={participants}
          users={users}
          loading={loading}
        />
      ) : (
        <Team
          spec={spec}
          refetch={refetch}
          users={users}
          participants={participants}
          loading={loading}
          maxTeamSize={maxTeamSize}
        />
      )}
    </div>
  );
};

export default memo(RegistrationManagement);
