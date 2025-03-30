import { IUser } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { useForm } from '@mantine/form';
import { Button, PasswordInput, TextInput } from '@ui/basics';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback } from 'react';

import styles from './settings.module.css';

const Settings: FC<{ user: IUser }> = ({ user }) => {
  const { locale, lang } = useLocale();

  const main_form = useForm({
    initialValues: {
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
      email: user.email || '',
    },
    validate: {
      email: (value: any) =>
        value &&
        value.length > 0 &&
        !value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
          ? locale.auth.errors.email
          : null,

      name: (value) =>
        value.length < 2
          ? locale.auth.errors.name.short
          : !value.match(/^[a-zA-Zа-яА-ЯЁё -]+$/)
            ? locale.auth.errors.name.invalid
            : null,
      surname: (value) =>
        value.length < 2
          ? locale.auth.errors.surname.short
          : !value.match(/^[a-zA-Zа-яА-ЯЁё -]+$/)
            ? locale.auth.errors.surname.invalid
            : null,
      patronymic: (value) =>
        !value.match(/^[a-zA-Zа-яА-ЯЁё -]*$/)
          ? locale.auth.errors.patronymic.invalid
          : null,
    },
    validateInputOnBlur: true,
  });

  const password_form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value) =>
        value.length < 5
          ? locale.auth.errors.password.len
          : //TODO: Check
            // eslint-disable-next-line no-useless-escape
            !value.match(/^[a-zA-Z\d\.]+$/)
            ? locale.auth.errors.password.symbols
            : null,
      confirmPassword: (value, values) =>
        value !== values.password ? locale.auth.errors.confirm : null,
    },
    validateInputOnBlur: true,
  });

  const handleMain = useCallback(() => {
    if (
      Object.keys(main_form.errors).length > 0 ||
      main_form.validate().hasErrors
    ) {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.validationError,
        autoClose: 5000,
      });
      return;
    }
    const body = main_form.values;
    requestWithNotify<
      {
        name: string;
        surname: string;
        patronymic: string;
        email?: string;
      },
      {}
    >(
      'profile/edit',
      'POST',
      locale.notify.profile.main,
      lang,
      (_) => '',
      body,
      () => window.location.reload()
    );
  }, [main_form, lang, locale]);

  const handlePassword = useCallback(() => {
    if (
      Object.keys(password_form.errors).length > 0 ||
      password_form.validate().hasErrors
    ) {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.validationError,
        autoClose: 5000,
      });
      return;
    }
    const body = { password: password_form.values.password };
    requestWithNotify<{ password: string }, {}>(
      'profile/password',
      'POST',
      locale.notify.profile.password,
      lang,
      (_) => '',
      body
    );
  }, [password_form, lang, locale]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <TextInput
          label={locale.auth.labels.name}
          {...main_form.getInputProps('name')}
        />
        <TextInput
          label={locale.auth.labels.surname}
          classNames={{
            label: styles.label,
          }}
          {...main_form.getInputProps('surname')}
        />
        <TextInput
          label={locale.auth.labels.patronymic}
          {...main_form.getInputProps('patronymic')}
        />
        <TextInput
          label={locale.auth.labels.email}
          {...main_form.getInputProps('email')}
        />
        <div className={styles.button}>
          <Button
            disabled={!main_form.isValid()}
            onClick={handleMain}
            variant="outline"
          >
            {locale.save}
          </Button>
        </div>
      </div>
      <div className={styles.password}>
        <PasswordInput
          label={locale.auth.labels.password}
          placeholder={locale.auth.placeholders.password}
          helperContent={
            <div>
              {locale.helpers.auth.password.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          }
          onBlur={() => {
            password_form.validateField('password');
            password_form.validateField('confirmPassword');
          }}
          {...password_form.getInputProps('password')}
        />
        <PasswordInput
          label={locale.auth.labels.confirmPassword}
          placeholder={locale.auth.placeholders.password}
          {...password_form.getInputProps('confirmPassword')}
        />
        <div className={styles.button}>
          <Button
            disabled={Object.keys(password_form.errors).length > 0}
            variant="outline"
            onClick={handlePassword}
          >
            {locale.save}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(Settings);
