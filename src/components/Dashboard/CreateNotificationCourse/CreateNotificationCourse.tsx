import { INewNotification } from '@custom-types/data/notification';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Button, CustomEditor, Helper, TextInput } from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import styles from './createNotificationCourse.module.css';
import { UserSelector } from '@ui/selectors';
import { useSearchParams } from 'next/navigation';
import { IUserDisplay } from '@custom-types/data/IUser';
import { sendRequest } from '@requests/request';
import { ILocale } from '@custom-types/ui/ILocale';

const CreateNotificationCourse: FC<{
  spec: string;
  type: string;
}> = ({ spec, type }) => {
  const params = useSearchParams();
  const { locale, lang } = useLocale();
  const { user } = useUser();
  const [users, setUsers] = useState<IUserDisplay[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const form = useForm({
    initialValues: {
      notificationTitle: '',
      notificationShortDescription: '',
      notificationDescription: '',
      selectedUsers: [] as string[],
    },
    validate: {
      notificationTitle: (value) =>
        value.length == 0 ? locale.notification.form.validate.title : null,

      notificationShortDescription: () => null,
      notificationDescription: () => null,
    },
    validateInputOnBlur: true,
  });

  const setFieldValue = useCallback(
    (users: string[]) => form.setFieldValue('selectedUsers', users),
    [] // eslint-disable-line
  );

  const initialProps = useMemo(() => {
    form.getInputProps('selectedUsers');
  }, []); // eslint-disable-line

  const handleSubmit = useCallback(() => {
    const notification: INewNotification = {
      spec: '',
      title: form.values.notificationTitle,
      shortDescription: form.values.notificationShortDescription,
      description: form.values.notificationDescription,
      logins: form.values.selectedUsers,
      groups: [],
      roles: [],
      author: user?.login || '',
      broadcast: false,
    };

    requestWithNotify<INewNotification, string>(
      `${type}/add-notification/${spec}`,
      'POST',
      locale.notify.notification.create,
      lang,
      (_: string) => '',
      notification
    );
  }, [type, spec, form.values, user?.login, locale, lang]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    if (params.has('group')) {
      const response = await sendRequest<{}, IUserDisplay[]>(
        `course/participant/${spec}/${params.get('group')}`,
        'GET'
      );
      if (!response.error) {
        setUsers(response.response);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  }, [params, spec]);

  useEffect(() => {
    fetchUsers();
    form.setFieldValue('selectedUsers', []);
  }, [params]);

  return (
    <>
      <div className={styles.notificationWrapper}>
        <div className={styles.notificationLabel}>
          <div>{locale.notification.notification}</div>
          <Helper
            dropdownContent={locale.helpers.notification.assignmentCreation}
          />
        </div>
        {loading ? (
          <>Loading</>
        ) : users && users.length > 0 ? (
          <UserSelector
            setFieldValue={setFieldValue}
            inputProps={initialProps}
            users={users}
            titles={(locale: ILocale) => [
              locale.ui.userSelector.unselectedGroupMembers,
              locale.ui.userSelector.selectedGroupMembers,
            ]}
          />
        ) : (
          <>Нет пользователей</>
        )}
        <TextInput
          label={locale.notification.form.title}
          required
          {...form.getInputProps('notificationTitle')}
        />
        <TextInput
          label={locale.notification.form.shortDescription}
          helperContent={
            <div>
              {locale.helpers.notification.shortDescription.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          }
          {...form.getInputProps('notificationShortDescription')}
        />
        <CustomEditor
          helperContent={
            <div>
              {locale.helpers.notification.description.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          }
          label={locale.notification.form.description}
          form={form}
          name={'notificationDescription'}
        />
      </div>
      <Group align="center">
        <Button
          disabled={Object.keys(form.errors).length > 0}
          onClick={handleSubmit}
        >
          {locale.create}
        </Button>
      </Group>
    </>
  );
};

export default memo(CreateNotificationCourse);
