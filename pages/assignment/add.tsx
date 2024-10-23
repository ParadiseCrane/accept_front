import { ReactNode, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { DefaultLayout } from '@layouts/DefaultLayout';
import {
  IAssignmentAdd,
  IAssignmentAddBundle,
} from '@custom-types/data/IAssignment';
import Form from '@components/Assignment/Form/Form';
import { useLocale } from '@hooks/useLocale';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useUser } from '@hooks/useUser';
import { UseFormReturnType } from '@mantine/form/lib/types';
import { INewNotification } from '@custom-types/data/notification';
import { sendRequest } from '@requests/request';
import Title from '@ui/Title/Title';
import { fetchWrapperStatic } from '@utils/fetchWrapper';

const initialValues = {
  origin: '',
  starter: '',
  startDate: new Date(),
  endDate: new Date(),
  groups: [],
  infinite: false,
  status: 0,
  dates: 0,
  notificationTitle: 'Вам задан новый урок',
  notificationDescription: '',
  notificationShortDescription: 'Проверьте вкладку "Мои уроки" в профиле',
};

function AssignmentAdd(props: IAssignmentAddBundle) {
  const { locale, lang } = useLocale();
  const { user } = useUser();

  const handleSubmit = useCallback(
    (form: UseFormReturnType<typeof initialValues>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.group.validation.error,
          autoClose: 500,
        });
        return;
      }

      const assignment = {
        spec: '',
        origin: form.values.origin,
        starter: user?.login || '',
        status: form.values.status,
        infinite: form.values.infinite,
        start: form.values.startDate,
        end: form.values.endDate,
        groups: form.values.groups,
      };

      requestWithNotify<IAssignmentAdd, string>(
        'assignment/add',
        'POST',
        locale.notify.assignment.create,
        lang,
        (response) => response,
        assignment
      );
      const notification: INewNotification = {
        spec: '',
        title: form.values.notificationTitle,
        shortDescription: form.values.notificationShortDescription,
        description: form.values.notificationDescription,
        logins: [],
        groups: form.values.groups,
        roles: [],
        author: user?.login || '',
        broadcast: false,
      };

      sendRequest<INewNotification, string>(
        'notification/add',
        'POST',
        notification
      );
    },
    [lang, locale, user?.login]
  );

  return (
    <>
      <Title title={locale.titles.assignment.add} />
      <Form
        shouldNotify={true}
        handleSubmit={handleSubmit}
        buttonLabel={locale.create}
        initialValues={initialValues}
        {...props}
      />
    </>
  );
}

AssignmentAdd.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AssignmentAdd;

export const getServerSideProps: GetServerSideProps = async ({
  query: _,
  req,
}) => {
  const response = await fetchWrapperStatic({
    url: 'bundle/assignment-add',
    req,
  });

  if (response.status === 200) {
    const response_json = await response.json();
    return {
      props: {
        assignment_schemas: response_json.schemas,
        groups: response_json.groups,
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
