import Form from '@components/Notification/Form/Form';
import { FC, memo, useMemo } from 'react';
import { useRequest } from '@hooks/useRequest';
import { IRole } from '@custom-types/data/atomic';
import { IGroup } from '@custom-types/data/IGroup';
import { IUserDisplay } from '@custom-types/data/IUser';
import { LoadingOverlay } from '@ui/basics';

const CrateNotification: FC<{}> = ({}) => {
  const { data, loading } = useRequest<
    {},
    any,
    {
      users: IUserDisplay[];
      groups: IGroup[];
      roles: IRole[];
    }
  >('notification/addBundle', 'GET');

  const users = useMemo(() => (data ? data.users : []), [data]);
  const groups = useMemo(() => (data ? data.groups : []), [data]);
  const roles = useMemo(() => (data ? data.roles : []), [data]);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '300px',
        margin: 'var(--spacer-xl) var(--spacer-l) 0 0',
      }}
    >
      <LoadingOverlay visible={loading} />
      {!loading && (
        <Form users={users} groups={groups} roles={roles} noDefault />
      )}
    </div>
  );
};

export default memo(CrateNotification);
