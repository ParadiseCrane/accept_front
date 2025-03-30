import Form from '@components/Organization/Form/Form';
import { IGroup } from '@custom-types/data/IGroup';
import { IOrganization } from '@custom-types/data/IOrganization';
import { IUserDisplay } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { UseFormReturnType } from '@mantine/form';
import Title from '@ui/Title/Title';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { GetServerSideProps } from 'next';
import { ReactNode, useCallback, useMemo } from 'react';

function EditOrganization(props: { organization: IOrganization }) {
  const organization = props.organization;

  const { locale, lang } = useLocale();

  const formValues = useMemo(
    () => ({
      ...organization,
    }),
    [organization]
  );

  const handleSubmit = useCallback(
    (form: UseFormReturnType<any>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.group.validation.error, //TODO: fix
          autoClose: 5000,
        });
        return;
      }
      requestWithNotify(
        `organization/edit`,
        'POST',
        locale.notify.group.edit, //TODO: fix
        lang,
        (spec: string) => spec,
        {
          spec: form.values.spec,
          name: form.values.name,
          description: form.values.description,
          allowRegistration: form.values.allowRegistration,
        }
      );
    },
    [locale, lang]
  );

  return (
    <div>
      <Title title={locale.titles.group.edit} />
      <Form
        handleSubmit={handleSubmit}
        initialValues={formValues}
        buttonText={locale.edit}
      />
    </div>
  );
}

EditOrganization.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default EditOrganization;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }
  const res = await fetchWrapperStatic({
    url: `organization/${query.spec}`,
    req,
  });
  if (res.status === 200) {
    const organization = await res.json();
    return {
      props: {
        organization: organization,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  };
};
