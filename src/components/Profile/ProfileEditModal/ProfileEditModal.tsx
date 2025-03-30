import { IRole } from '@custom-types/data/atomic';
import { IUser } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { useUser } from '@hooks/useUser';
import { useForm } from '@mantine/form';
import { LoadingOverlay, Select, TextInput } from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback } from 'react';

import styles from './profileEditModal.module.css';

const ProfileEditModal: FC<{
  user: IUser;
  opened: boolean;
  setOpened: (_: boolean) => void;
}> = ({ user, opened, setOpened }) => {
  const { locale, lang } = useLocale();
  const { accessLevel } = useUser();

  const form = useForm({
    initialValues: {
      login: user.login,
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
      role: user.role.spec.toString(),
    },
  });

  const close = useCallback(() => setOpened(false), [setOpened]);

  const filterRoles = useCallback(
    (data: IRole[]) => data.filter((item) => item.accessLevel <= accessLevel),
    [accessLevel]
  );

  const { data, loading } = useRequest<{}, IRole[]>(
    'role',
    'GET',
    undefined,
    filterRoles
  );

  const handleSubmit = useCallback(() => {
    requestWithNotify(
      'profile/editAdmin',
      'PUT',
      locale.notify.profile.main,
      lang,
      () => '',
      form.values,
      () => location.reload()
    );
  }, [locale, lang, form.values]);

  return (
    <SimpleModal opened={opened} close={close} title={locale.profile.editModal}>
      <div className={styles.wrapper}>
        <div className={styles.fields}>
          <TextInput
            label={locale.auth.labels.name}
            size="lg"
            {...form.getInputProps('name')}
          />
          <TextInput
            label={locale.auth.labels.surname}
            size="lg"
            {...form.getInputProps('surname')}
          />
          <TextInput
            label={locale.auth.labels.patronymic}
            size="lg"
            {...form.getInputProps('patronymic')}
          />
          <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />
            <Select
              label={locale.users.list.role}
              data={
                !data
                  ? []
                  : data.map((role) => ({
                      label: role.name,
                      value: role.spec.toString(),
                    }))
              }
              {...form.getInputProps('role')}
            />
          </div>
        </div>
        <SimpleButtonGroup
          actionButton={{
            label: locale.edit,
            onClick: handleSubmit,
          }}
          cancelButton={{
            label: locale.cancel,
            onClick: close,
          }}
        />
      </div>
    </SimpleModal>
  );
};

export default memo(ProfileEditModal);
