import Form from '@components/Group/Form/Form';
import { useLocale } from '@hooks/useLocale';
import { ReactNode, useCallback, useMemo } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { getApiUrl } from '@utils/getServerUrl';
import { GetStaticPaths, GetStaticProps } from 'next';
import { IGroup } from '@custom-types/data/IGroup';
import { requestWithNotify } from '@utils/requestWithNotify';
import { IUser } from '@custom-types/data/IUser';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';

function EditGroup(props: { group: IGroup; users: IUser[] }) {
  const group = props.group;
  const users = props.users;

  const { locale, lang } = useLocale();

  const formValues = useMemo(
    () => ({
      ...group,
      members: users
        .filter(
          (user) =>
            user.groups.findIndex(
              (item) => item.spec === group.spec
            ) >= 0
        )
        .map((user) => user.login),
    }),
    [group, users]
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
        (response: IGroup) => response.spec,
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
      <Form
        handleSubmit={handleSubmit}
        initialValues={formValues}
        buttonText={locale.edit}
        users={users}
      />
    </div>
  );
}

EditGroup.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default EditGroup;

const API_URL = getApiUrl();

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || typeof params?.spec !== 'string') {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  const groupBundleResponse = await fetch(
    `${API_URL}/api/bundle/group-edit/${params.spec}`,
    {
      method: 'GET',
    }
  );
  if (groupBundleResponse.status === 200) {
    const groupBundle = await groupBundleResponse.json();
    return {
      props: {
        group: groupBundle.group,
        users: groupBundle.users,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/Not-Found',
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
