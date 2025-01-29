import Form from '@components/Organization/Form/Form';
import { IGroup } from '@custom-types/data/IGroup';
import { IOrganization } from '@custom-types/data/IOrganization';
import { IUserDisplay } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { UseFormReturnType } from '@mantine/form';
import Title from '@ui/Title/Title';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { ReactNode, useCallback } from 'react';

const initialValues = {
  spec: '',
  name: '',
  description: '',
  allowRegistration: false,
};

function AddOrganization() {
  const { locale, lang } = useLocale();

  const handleSubmit = useCallback(
    (form: UseFormReturnType<any>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.group.validation.error, // TODO: Fix locale
          autoClose: 5000,
        });
        return;
      }
      requestWithNotify<
        IOrganization,
        { admin_login: string; admin_password: string }
      >(
        'organization/add',
        'POST',
        locale.notify.group.create, // TODO: Fix locale
        lang,
        (res) => `${res.admin_login}\n${res.admin_password}`,
        {
          spec: form.values.spec,
          name: form.values.name,
          description: form.values.description,
          allowRegistration: form.values.allowRegistration,
        },
        undefined,
        { autoClose: false }
      );
    },
    [locale, lang]
  );

  return (
    <>
      <Title title={locale.titles.group.add} />
      <Form
        handleSubmit={handleSubmit}
        buttonText={locale.create}
        initialValues={initialValues}
      />
    </>
  );
}

AddOrganization.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AddOrganization;
