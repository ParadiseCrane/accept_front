import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LoginLayout } from '@layouts/LoginLayout';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { Button, PasswordInput, Select, TextInput } from '@ui/basics';
import styles from '@styles/auth/login.module.css';
import Link from 'next/link';
import {
  errorNotification,
  newNotification,
  successNotification,
} from '@utils/notificationFunctions';
import { useRequest } from '@hooks/useRequest';
import { IOrganization } from '@custom-types/data/IOrganization';
import { SelectItem } from '@mantine/core';

function SignIn() {
  const { locale } = useLocale();
  const { signIn } = useUser();
  const router = useRouter();

  const {
    data: organizations,
    loading: organizations_loading,
    error,
  } = useRequest<object, IOrganization[], SelectItem[]>(
    'organization/list',
    'GET',
    undefined,
    (organizations: IOrganization[]) =>
      organizations.map(
        (organization) =>
          ({
            value: organization.spec,
            label: organization.name,
          }) as SelectItem
      )
  );

  const valid_organizations = useMemo(
    () => organizations?.map((item) => item.value) || [],
    [organizations]
  );

  const form = useForm({
    initialValues: {
      organization: '',
      login: '',
      password: '',
    },
    validate: {
      organization: (value) =>
        value === ''
          ? 'Выберите организацию' // TODO add locale
          : !valid_organizations.includes(value)
            ? 'Неверная организация' // TODO add locale
            : null,
      login: (value) =>
        value.length == 0 ? locale.auth.errors.login.exists : null,
      password: (value) =>
        value.length == 0 ? locale.auth.errors.password.exists : null,
    },
    validateInputOnBlur: true,
  });

  const [loading, setLoading] = useState(false);
  const [toSignIn, setToSignIn] = useState(false);

  const handleSignIn = useCallback(
    (values: {
      organization: string;
      login: string;
      password: string;
    }) => {
      if (form.validate().hasErrors) return;
      const id = newNotification({
        title: locale.notify.auth.signIn.loading,
        message: locale.loading + '...',
      });
      setLoading(true);
      signIn(values.organization, values.login, values.password).then(
        (res) => {
          if (res) {
            successNotification({
              id,
              title: locale.notify.auth.signIn.success,
              autoClose: 5000,
            });
            router.push((router.query.referrer as string) || '/');
          } else {
            errorNotification({
              id,
              title: locale.notify.auth.signIn.error,
              autoClose: 5000,
            });
          }
          setLoading(false);
        }
      );
    },
    [form, locale, signIn, router]
  );

  useEffect(() => {
    if (!toSignIn) return;
    handleSignIn(form.values);
    setToSignIn(false);
  }, [toSignIn, handleSignIn, form.values]);

  const processKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setToSignIn(true);
    }
  }, []);

  useEffect(() => {
    if (!window) return;
    window.addEventListener('keydown', processKeydown);
    return () => {
      window.removeEventListener('keydown', processKeydown);
    };
  }, [processKeydown]);

  return (
    <>
      <form className={styles.formWrapper}>
        <Select
          required
          id="organization"
          label={'Организация'} // TODO add locale
          data={organizations || []}
          disabled={!!!organizations || organizations_loading}
          placeholder={'Выберете организацию'} // TODO add locale
          classNames={{
            label: styles.label,
          }}
          size="lg"
          {...form.getInputProps('organization')}
        />
        <TextInput
          required
          id="login"
          label={locale.auth.labels.login}
          placeholder={locale.auth.placeholders.login}
          classNames={{
            label: styles.label,
          }}
          size="lg"
          {...form.getInputProps('login')}
        />
        <PasswordInput
          required
          label={locale.auth.labels.password}
          id="password"
          placeholder={locale.auth.placeholders.password}
          classNames={{
            label: styles.label,
          }}
          size="lg"
          {...form.getInputProps('password')}
        />
        <Button
          type="button"
          onClick={(_) => handleSignIn(form.values)}
          disabled={Object.keys(form.errors).length > 0 || loading}
          className={styles.enterButton}
        >
          {locale.auth.submit}
        </Button>
      </form>
      <div className={styles.footer}>
        <div className={styles.footerLine}>
          <span className={styles.footerText}>
            {locale.auth.footer.noAccount}
          </span>
          <Link
            href={`/signup?referrer=${router.query.referrer}`}
            className={styles.footerLink}
          >
            {locale.auth.footer.register}
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

SignIn.getLayout = (page: ReactElement) => {
  return <LoginLayout title={'login'}>{page}</LoginLayout>;
};
export default SignIn;
