import { ReactNode, useCallback } from 'react';
import { GetServerSideProps, GetStaticProps } from 'next';
import { getApiUrl } from '@utils/getServerUrl';
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
import { REVALIDATION_TIME } from '@constants/PageRevalidation';
import { getCookieValue } from '@utils/cookies';

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

const API_URL = getApiUrl();

export const getServerSideProps: GetServerSideProps = async ({
  query: _,
  req,
}) => {
  const access_token = getCookieValue(req.headers.cookie || '', 'access_token');

  const response = await fetch(`${API_URL}/api/bundle/assignment-add`, {
    method: 'GET',
    headers: {
      cookie: req.headers.cookie,
      Authorization: `Bearer ${access_token}`,
    } as { [key: string]: string },
  });
  if (response.status === 200) {
    const response_json = await response.json();
    return {
      props: {
        assignment_schemas: response_json.schemas,
        groups: response_json.groups,
      },
      revalidate: REVALIDATION_TIME.assignment.add,
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  };
};
