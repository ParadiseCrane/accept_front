import { IUserDisplay } from '@custom-types/data/IUser';
import { Overlay } from '@ui/basics';
import { UserSelector } from '@ui/selectors';
import { FC, memo, useCallback, useMemo } from 'react';

const Users: FC<{ form: any; users: IUserDisplay[] }> = ({
  form,
  users,
}) => {
  const setFieldValue = useCallback(
    (users: string[]) => form.setFieldValue('logins', users),
    [] // eslint-disable-line
  );
  const initialProps = useMemo(() => {
    form.getInputProps('logins');
  }, []); // eslint-disable-line
  return (
    <div style={{ position: 'relative' }}>
      {form.values.broadcast && <Overlay />}
      <UserSelector
        setFieldValue={setFieldValue}
        inputProps={initialProps}
        users={users}
        initialUsers={form.values.logins}
      />
    </div>
  );
};

export default memo(Users);
