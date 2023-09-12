import { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { IGroup } from '@custom-types/data/IGroup';
import { useLocale } from '@hooks/useLocale';
import { Button } from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { UserSelector } from '@ui/selectors';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import styles from './addGrade.module.css';
import { useRequest } from '@hooks/useRequest';
import { IUser } from '@custom-types/data/IUser';
import { LoadingOverlay, TextInput } from '@ui/basics';

const initialValues = {
  spec: '',
  name: '',
  readonly: true,
  members: [] as string[],
};

const AddGrade: FC<{}> = ({}) => {
  const { locale, lang } = useLocale();

  const { data, loading } = useRequest<{}, IUser[]>(
    'user/list',
    'GET'
  );
  const users = useMemo(
    () => (data && data.length > 0 ? data : []),
    [data]
  );

  const handleSubmit = useCallback(
    (form: UseFormReturnType<any>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.group.validation.error,
          autoClose: 5000,
        });
        return;
      }
      requestWithNotify<
        { group: IGroup; members: string[] },
        boolean
      >(
        'group/add',
        'POST',
        locale.notify.group.create,
        lang,
        (_: boolean) => '',
        {
          group: {
            spec: form.values.spec,
            name: form.values.name,
            readonly: form.values.readonly,
          },
          members: form.values.members,
        }
      );
    },
    [locale, lang]
  );

  const form = useForm({
    initialValues,
  });

  const setFieldValue = useCallback(
    (users: string[]) => form.setFieldValue('members', users),
    [] // eslint-disable-line
  );
  const initialProps = useMemo(() => {
    form.getInputProps('members');
  }, []); // eslint-disable-line

  useEffect(() => {
    form.setValues(initialValues);
  }, [initialValues]); //eslint-disable-line

  return (
    <div className={styles.wrapper}>
      <TextInput
        label={locale.group.name}
        required
        {...form.getInputProps('name')}
      />

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <UserSelector
          key={users.length}
          setFieldValue={setFieldValue}
          inputProps={initialProps}
          users={users}
          initialUsers={[]}
        />
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          onClick={() => handleSubmit(form)}
          disabled={Object.keys(form.errors).length > 0}
        >
          {locale.create}
        </Button>
      </div>
    </div>
  );
};

export default memo(AddGrade);
