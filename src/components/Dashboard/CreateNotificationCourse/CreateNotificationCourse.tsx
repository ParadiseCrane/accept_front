'use client';
import { INewNotification } from '@custom-types/data/notification';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  Button,
  CustomEditor,
  Helper,
  LoadingOverlay,
  TextInput,
} from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import styles from './createNotificationCourse.module.css';
import { GroupSelector, UserSelector } from '@ui/selectors';
import { useSearchParams } from 'next/navigation';
import { IUserDisplay } from '@custom-types/data/IUser';
import { sendRequest } from '@requests/request';
import { ILocale } from '@custom-types/ui/ILocale';
import { IGroup } from '@custom-types/data/IGroup';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';

const CreateNotificationCourse: FC<{
  spec: string;
  type: string;
}> = ({ spec, type }) => {
  const searchParams = useSearchParams();
  const { locale, lang } = useLocale();
  const { user } = useUser();
  const [users, setUsers] = useState<IUserDisplay[] | null>(null);
  const [groups, setGroups] = useState<IGroup[] | null>(null);
  const [initialGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const form = useForm({
    initialValues: {
      notificationTitle: '',
      notificationShortDescription: '',
      notificationDescription: '',
      selectedUsers: [] as string[],
      groups: [],
    },
    validate: {
      notificationTitle: (value) =>
        value.length == 0 ? locale.notification.form.validate.title : null,

      notificationShortDescription: () => null,
      notificationDescription: () => null,
      groups: (_, values) =>
        !(values.selectedUsers.length > 0) && !(values.groups.length > 0)
          ? locale.notification.form.validate.users
          : null,
      selectedUsers: (_, values) =>
        !(values.selectedUsers.length > 0) && !(values.groups.length > 0)
          ? locale.notification.form.validate.users
          : null,
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
    if (form.validate().hasErrors) {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.validationError,
        autoClose: 5000,
      });
      return;
    }

    const notification: INewNotification = {
      spec: '',
      title: form.values.notificationTitle,
      shortDescription: form.values.notificationShortDescription,
      description: form.values.notificationDescription,
      logins: form.values.selectedUsers,
      groups: form.values.groups,
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
  }, [type, spec, form, user?.login, locale, lang]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    if (searchParams && searchParams.has('group')) {
      const response = await sendRequest<{}, IUserDisplay[]>(
        `course/participant/${spec}/${searchParams.get('group')}`,
        'GET'
      );
      if (!response.error) {
        setUsers(response.response);
      } else {
        setUsers([]);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  }, [searchParams, spec]);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const response = await sendRequest<{}, IGroup[]>(
      `course/groups/${spec}`,
      'GET',
      undefined
    );
    if (!response.error) {
      setGroups(response.response);
    } else {
      setGroups([]);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  }, [spec]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  if (!users || !groups || loading) {
    return (
      <div style={{ position: 'relative', height: '100%' }}>
        <LoadingOverlay visible={loading} loaderProps={{ radius: 'lg' }} />
      </div>
    );
  }

  if (!loading && !users.length) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.emptyMessageWrapper}>
          <div className={styles.emptyMessage}>
            <div>{locale.dashboard.course.noUsersNotification}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.notificationWrapper}>
        <div className={styles.notificationLabel}>
          <div>{locale.notification.notification}</div>
          <Helper
            dropdownContent={locale.helpers.notification.assignmentCreation}
          />
        </div>

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
      <UserSelector
        setFieldValue={setFieldValue}
        inputProps={initialProps}
        users={users}
        titles={(locale: ILocale) => [
          locale.ui.userSelector.unselectedGroupMembers,
          locale.ui.userSelector.selectedGroupMembers,
        ]}
      />
      <GroupSelector
        form={form}
        groups={groups}
        initialGroups={initialGroups}
        field={'groups'}
      />
      <Group
        align="center"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
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
