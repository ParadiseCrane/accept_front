import { LoginLayout } from '@layouts/LoginLayout';
import { ReactElement, useCallback } from 'react';
import { useLocale } from '@hooks/useLocale';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import styles from '@styles/auth/login.module.css';
import Link from 'next/link';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { IRegUser } from '@custom-types/data/IUser';
import { requestWithNotify } from '@utils/requestWithNotify';
import { sendRequest } from '@requests/request';
import {
  AlignJustified,
  LetterCase,
  ShieldLock,
} from 'tabler-icons-react';
import { PasswordInput, TextInput } from '@ui/basics';
import Stepper from '@ui/Stepper/Stepper';
import { useWidth } from '@hooks/useWidth';
import { rem } from '@mantine/core';

const stepFields = [
  ['login'],
  ['password', 'confirmPassword'],
  ['name', 'email'],
];

function SignUp() {
  const { locale, lang } = useLocale();
  const router = useRouter();
  const { width } = useWidth();

  const form = useForm({
    initialValues: {
      login: '',
      password: '',
      email: '',
      name: '',
      confirmPassword: '',
    },
    validate: {
      login: (value) =>
        value.length < 5
          ? locale.auth.errors.login.len
          : !value.match(/^[a-zA-Z][a-zA-Z_]+$/)
            ? locale.auth.errors.login.symbols
            : null,
      password: (value) =>
        value.length < 5
          ? locale.auth.errors.password.len
          : !value.match(/^[a-zA-Z\d\.]+$/)
            ? locale.auth.errors.password.symbols
            : null,
      confirmPassword: (value, values) =>
        value !== values.password ? locale.auth.errors.confirm : null,
      email: (value) =>
        value.length > 0 &&
        !value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
          ? locale.auth.errors.email
          : null,

      name: (value) =>
        value.length > 50
          ? locale.auth.errors.name.len
          : value.trim().split(' ').length < 2
            ? locale.auth.errors.name.surname
            : !value.match(/^[a-zA-Zа-яА-ЯЁё -]+$/)
              ? locale.auth.errors.name.invalid
              : null,
    },
    validateInputOnBlur: true,
  });

  const onLoginBlur = useCallback(() => {
    if (!form.validateField('login').hasError) {
      sendRequest<undefined, boolean>(
        `auth/validateLogin/${form.values.login}`,
        'GET',
        undefined,
        60000
      ).then((res) => {
        form.setFieldError(
          'login',
          !res.error && !res.response
            ? locale.auth.errors.login.used
            : null
        );
      });
    }
  }, [form, locale]);

  const handleSignUp = useCallback(() => {
    if (
      Object.keys(form.errors).length > 0 ||
      form.validate().hasErrors
    ) {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.validationError,
        autoClose: 5000,
      });
      return;
    }
    const name = form.values.name.split(' ');
    const user: IRegUser = {
      login: form.values.login,
      password: form.values.password,
      email: form.values.email || '',
      name: name[1],
      surname: name[0],
      patronymic: name.length > 2 ? name[2] : '',
    };

    requestWithNotify<IRegUser, boolean>(
      'auth/signup',
      'POST',
      locale.notify.auth.signUp,
      lang,
      (_) => '',
      user,
      () => router.push(`/signin?referrer=${router.query.referrer}`)
    );
  }, [locale, lang, form, router]);

  return (
    <>
      <Stepper
        handleSubmit={handleSignUp}
        buttonLabel={locale.auth.footer.register}
        contentClass={styles.formWrapper}
        customWrapper
        iconPosition="left"
        form={form}
        stepFields={stepFields}
        icons={[
          <LetterCase
            key={0}
            style={{ width: rem(24), height: rem(24) }}
          />,
          <ShieldLock
            key={1}
            style={{ width: rem(24), height: rem(24) }}
          />,
          <AlignJustified
            key={2}
            style={{ width: rem(24), height: rem(24) }}
          />,
        ]}
        descriptions={['', '', '']}
        labels={locale.auth.steps.labels}
        pages={[
          <>
            <TextInput
              id="login"
              required
              label={locale.auth.labels.login}
              placeholder={locale.auth.placeholders.login}
              classNames={{
                label: styles.label,
              }}
              helperContent={
                <div>
                  {locale.helpers.auth.login.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              }
              size="lg"
              {...form.getInputProps('login')}
              onBlur={onLoginBlur}
            />
          </>,
          <>
            <PasswordInput
              id="password"
              required
              label={locale.auth.labels.password}
              placeholder={locale.auth.placeholders.password}
              classNames={{
                label: styles.label,
              }}
              size="lg"
              helperContent={
                <div>
                  {locale.helpers.auth.password.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              }
              {...form.getInputProps('password')}
              onBlur={() => {
                form.validateField('password');
                form.validateField('confirmPassword');
              }}
            />
            <PasswordInput
              id="confirmPassword"
              required
              label={locale.auth.labels.confirmPassword}
              placeholder={locale.auth.placeholders.password}
              classNames={{
                label: styles.label,
              }}
              size="lg"
              {...form.getInputProps('confirmPassword')}
            />
          </>,
          <>
            <TextInput
              id="name"
              required
              label={locale.auth.labels.fullName}
              placeholder={locale.auth.placeholders.fullName}
              classNames={{
                label: styles.label,
              }}
              size="lg"
              {...form.getInputProps('name')}
            />
            <TextInput
              id="email"
              label={locale.auth.labels.email}
              placeholder={locale.auth.placeholders.email}
              classNames={{
                label: styles.label,
              }}
              size="lg"
              {...form.getInputProps('email')}
            />
          </>,
        ]}
      />
      <div className={styles.footer}>
        <div className={styles.footerLine}>
          <span className={styles.footerText}>
            {locale.auth.footer.hasAccount}
          </span>
          <Link
            href={`/signin?referrer=${router.query.referrer}`}
            className={styles.footerLink}
          >
            {locale.auth.footer.login}
          </Link>
        </div>
        <div className={styles.footerLine}>
          <span className={styles.footerText}>
            {locale.auth.footer.returnTo}
          </span>
          <Link href="/" className={styles.footerLink}>
            {locale.auth.footer.mainPage}
          </Link>
        </div>
      </div>
    </>
  );
}

SignUp.getLayout = (page: ReactElement) => {
  return <LoginLayout title={'registration'}>{page}</LoginLayout>;
};
export default SignUp;
