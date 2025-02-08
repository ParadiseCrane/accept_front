import { IUserDisplay } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { useForm, UseFormReturnType } from '@mantine/form';
import { Button } from '@ui/basics';
import { UserSelector } from '@ui/selectors';
import { FC, memo, useCallback, useMemo } from 'react';
// import styles from './moderators.module.css'

const initialValues: IModerators = {
  moderators: [],
  users: [
    {
      role: { accessLevel: 1, name: 'Moderator', spec: 32 },
      login: 'Login',
      shortName: 'Short name',
    },
  ],
};

interface IModerators {
  users: IUserDisplay[];
  moderators: string[];
}

const Moderators: FC = () => {
  const { locale } = useLocale();
  const form = useForm<IModerators>({ initialValues: initialValues });
  const setFieldValue = useCallback(
    (users: string[]) => form.setFieldValue('moderators', users),
    [] // eslint-disable-line
  );
  const initialProps = useMemo(() => {
    form.getInputProps('moderators');
  }, []); // eslint-disable-line
  const handleSubmit = (
    form: UseFormReturnType<IModerators, (values: IModerators) => IModerators>
  ) => {};
  return (
    <>
      <UserSelector
        setFieldValue={setFieldValue}
        inputProps={initialProps}
        users={form.values.users}
        initialUsers={form.values.moderators}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={() => {
            handleSubmit(form);
          }}
        >
          {locale.save}
        </Button>
      </div>
    </>
  );
};

export default memo(Moderators);
