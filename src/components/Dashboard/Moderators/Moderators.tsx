import { IUserDisplay } from '@custom-types/data/IUser';
import { useForm } from '@mantine/form';
import { UserSelector } from '@ui/selectors';
import { FC, memo, useCallback, useMemo } from 'react';
// import styles from './moderators.module.css'

const initialValues: IModerators = {
  moderators: [],
  users: [],
};

interface IModerators {
  users: IUserDisplay[];
  moderators: string[];
}

const Moderators: FC = () => {
  const form = useForm<IModerators>({ initialValues: initialValues });
  const setFieldValue = useCallback(
    (users: string[]) => form.setFieldValue('moderators', users),
    [] // eslint-disable-line
  );
  const initialProps = useMemo(() => {
    form.getInputProps('moderators');
  }, []); // eslint-disable-line
  return (
    <>
      <UserSelector
        setFieldValue={setFieldValue}
        inputProps={initialProps}
        users={form.values.users}
        initialUsers={form.values.moderators}
      />
    </>
  );
};

export default memo(Moderators);
