import Form from '@components/Group/Form/Form';
import { useLocale } from '@hooks/useLocale';
import { ReactNode, useCallback, useMemo } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { GetServerSideProps } from 'next';
import { IGroup } from '@custom-types/data/IGroup';
import { requestWithNotify } from '@utils/requestWithNotify';
import { IUserDisplay } from '@custom-types/data/IUser';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import Title from '@ui/Title/Title';
import { useRequest } from '@hooks/useRequest';
import { fetchWrapperStatic } from '@utils/fetchWrapper';

function EditGroup(props: { group: IGroup; members: string[] }) {
  const { data: users } = useRequest<{}, IUserDisplay[]>(
    'user/list-display',
    'GET',
    undefined,
    undefined,
    undefined,
    undefined,
    20000
  );

  const group = props.group;
  const members = props.members;

  const { locale, lang } = useLocale();

  const formValues = useMemo(
    () => ({
      ...group,
      members,
    }),
    [group, members]
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
      requestWithNotify(
        `group/edit`,
        'POST',
        locale.notify.group.edit,
        lang,
        (spec: string) => spec,
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

  return (
    <div>
      <Title title={locale.titles.group.edit} />
      <Form
        handleSubmit={handleSubmit}
        initialValues={formValues}
        buttonText={locale.edit}
        users={users || []}
      />
    </div>
  );
}

EditGroup.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default EditGroup;

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
  const groupBundleResponse = await fetchWrapperStatic({
    url: `bundle/group-edit/${query.spec}`,
    req,
  });
  if (groupBundleResponse.status === 200) {
    const groupBundle = await groupBundleResponse.json();
    return {
      props: {
        group: groupBundle.group,
        members: groupBundle.members,
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
