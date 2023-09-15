import { FC, memo } from 'react';
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

  return (
    <div className={styles.wrapper}>
      {maxTeamSize == 1 ? (
        <Solo
          spec={spec}
          refetch={refetch}
          initialParticipants={data?.participants || []}
          users={data?.users || []}
          loading={loading}
        />
      ) : (
        <Team
          spec={spec}
          refetch={refetch}
          users={data?.users || []}
          loading={loading}
        />
      )}
    </div>
  );
};

export default memo(RegistrationManagement);
