import Form from '@components/Group/Form/Form';
import { IGroup } from '@custom-types/data/IGroup';
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
  readonly: false,
  members: [],
};

function AddGroup() {
  const { data: users } = useRequest<{}, IUserDisplay[]>(
    'user/list-display',
    'GET',
    undefined,
    undefined,
    undefined,
    undefined,
    20000
  );

  const { locale, lang } = useLocale();

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
      requestWithNotify<{ group: IGroup; members: string[] }, boolean>(
        'group/add',
        'POST',
        locale.notify.group.create,
        lang,
        (_: boolean) => '',
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
    <>
      <Title title={locale.titles.group.add} />
      <Form
        handleSubmit={handleSubmit}
        buttonText={locale.create}
        initialValues={initialValues}
        users={users || []}
      />
    </>
  );
}

AddGroup.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AddGroup;
