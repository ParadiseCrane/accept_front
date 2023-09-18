import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './addUser.module.css';
import { useForm } from '@mantine/form';
import { Button, TextInput } from '@ui/basics';
import { GroupSelector, SingleRoleSelector } from '@ui/selectors';
import { IGroup } from '@custom-types/data/IGroup';
import { IRole } from '@custom-types/data/atomic';
import { useRequest } from '@hooks/useRequest';
import { useLocale } from '@hooks/useLocale';
import { requestWithNotify } from '@utils/requestWithNotify';

const AddUser: FC<{}> = ({}) => {
  const form = useForm({
    initialValues: {
      login: '',
      name: '',
      surname: '',
      patronymic: '',
      password: '',
      role: '1',
      groups: [],
    },
    validate: {
      login: (value) =>
        !value.match(/^[a-zA-Z\d]+[a-zA-Z\d_]+$/)
          ? locale.auth.errors.login.symbols
          : null,
      password: (value) =>
        !value.match(/^[a-zA-Z\d\.]+$/)
          ? locale.auth.errors.password.symbols
          : null,
      name: (value) =>
        !value.match(/^[a-zA-Zа-яА-ЯЁё -]+$/)
          ? locale.auth.errors.name.invalid
          : null,
      surname: (value) =>
        !value.match(/^[a-zA-Zа-яА-ЯЁё -]+$/)
          ? locale.auth.errors.surname.invalid
          : null,
      patronymic: (value) =>
        !value.match(/^[a-zA-Zа-яА-ЯЁё -]*$/)
          ? locale.auth.errors.patronymic.invalid
          : null,
      role: (value) =>
        value.length == 0 ? locale.auth.errors.role : null,
    },
    validateInputOnBlur: true,
  });
  const { locale, lang } = useLocale();

  const { data, loading } = useRequest<
    {},
    {
      groups: IGroup[];
      roles: IRole[];
    }
  >('user/addBundle', 'GET');

  const groups = useMemo(() => (data ? data.groups : []), [data]);
  const roles = useMemo(() => (data ? data.roles : []), [data]);

  const handleSubmit = useCallback(() => {
    if (form.validate().hasErrors) {
      return;
    }
    const user = {
      ...form.values,
      role: +form.values.role,
    };
    requestWithNotify<any, undefined>(
      'user/add',
      'POST',
      locale.notify.user.add,
      lang,
      (_) => '',
      user
    );
  }, [form, locale, lang]);

  const [hasErrors, setHasErrors] = useState(false);

  useEffect(() => {
    if (Object.keys(form.errors).length > 0) {
      setHasErrors(true);
    } else {
      setHasErrors(false);
    }
  }, [form.errors]);

  const initialGroups = useMemo(() => [], []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.fields}>
        <div className={styles.main}>
          <TextInput
            label={locale.auth.labels.login}
            placeholder={locale.auth.placeholders.login}
            {...form.getInputProps('login')}
          />
          <TextInput
            label={locale.auth.labels.password}
            placeholder={locale.auth.placeholders.password}
            {...form.getInputProps('password')}
          />
        </div>
        <div className={styles.fullName}>
          <TextInput
            label={locale.auth.labels.surname}
            placeholder={locale.auth.placeholders.surname}
            {...form.getInputProps('surname')}
          />
          <TextInput
            label={locale.auth.labels.name}
            placeholder={locale.auth.placeholders.name}
            {...form.getInputProps('name')}
          />
          <TextInput
            label={locale.auth.labels.patronymic}
            placeholder={locale.auth.placeholders.patronymic}
            {...form.getInputProps('patronymic')}
          />
        </div>
        {!loading && (
          <div className={styles.selectors}>
            <div className={styles.roleSelector}>
              <SingleRoleSelector
                label={locale.auth.labels.role}
                form={form}
                roles={roles}
                field="role"
              />
            </div>
            <div className={styles.groupWrapper}>
              <GroupSelector
                form={form}
                groups={groups}
                initialGroups={initialGroups}
                width={'80%'}
                field="groups"
              />
            </div>
          </div>
        )}
      </div>
      <Button onClick={handleSubmit} disabled={hasErrors}>
        {locale.add}
      </Button>
    </div>
  );
};

export default memo(AddUser);
