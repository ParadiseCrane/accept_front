import Form from '@components/Group/Form/Form';
import { IGroup } from '@custom-types/data/IGroup';
import { IUserDisplay } from '@custom-types/data/IUser';
import { callback } from '@custom-types/ui/atomic';
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
import { useRouter } from 'next/router';
import { FC, ReactNode, useCallback, useMemo } from 'react';

const initialValues = {
  spec: '',
  name: '',
  readonly: false,
  members: [],
};

function AddGroup() {
  const router = useRouter();
  const course = useMemo(() => router.query.course, [router.query.course]);
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
        `course/group/${course}`,
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
    [locale, course, lang]
  );

  return (
    <>
      <Title title={locale.titles.group.add} />
      <FormWithUsers handleSubmit={handleSubmit} />
    </>
  );
}

const FormWithUsers: FC<{ handleSubmit: callback<UseFormReturnType<any>> }> = ({
  handleSubmit,
}) => {
  const { data: users } = useRequest<{}, IUserDisplay[]>(
    'user/list-display',
    'GET',
    undefined,
    undefined,
    undefined,
    undefined,
    20000
  );
  const { locale } = useLocale();

  return (
    <Form
      handleSubmit={handleSubmit}
      buttonText={locale.create}
      initialValues={initialValues}
      users={users || []}
    />
  );
};

AddGroup.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AddGroup;
