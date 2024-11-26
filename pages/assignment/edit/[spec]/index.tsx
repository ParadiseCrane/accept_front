import { ReactNode, useCallback, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { DefaultLayout } from '@layouts/DefaultLayout';
import {
  IAssignmentAdd,
  IAssignmentEditBundle,
} from '@custom-types/data/IAssignment';
import Form from '@components/Assignment/Form/Form';
import { UseFormReturnType } from '@mantine/form';
import { useLocale } from '@hooks/useLocale';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { timezoneDate } from '@utils/datetime';
import Title from '@ui/Title/Title';
import { fetchWrapperStatic } from '@utils/fetchWrapper';

function AssignmentEdit(props: IAssignmentEditBundle) {
  const { locale, lang } = useLocale();

  const initialValues = useMemo(
    () => ({
      ...props.assignment,
      startDate: timezoneDate(props.assignment.start),
      endDate: timezoneDate(props.assignment.end),
      notificationTitle: '',
      notificationDescription: '',
      notificationShortDescription: '',
    }),
    [props]
  );

  const handleSubmit = useCallback(
    (form: UseFormReturnType<typeof initialValues>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.group.validation.error,
          autoClose: 5000,
        });
        return;
      }

      const assignment = {
        spec: form.values.spec,
        origin: form.values.origin,
        starter: form.values.starter,
        status: form.values.status,
        infinite: form.values.infinite,
        start: form.values.startDate,
        end: form.values.endDate,
        groups: form.values.groups,
      };

      requestWithNotify<IAssignmentAdd, IAssignmentAdd>(
        `assignment/edit`,
        'POST',
        locale.notify.assignment.edit,
        lang,
        (response: IAssignmentAdd) => response.spec,
        assignment
      );
    },
    [lang, locale]
  );

  return (
    <>
      <Title title={locale.titles.assignment.edit} />
      <Form
        shouldNotify={false}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        buttonLabel={locale.edit}
        {...props}
      />
    </>
  );
}

AssignmentEdit.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AssignmentEdit;

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

  const response = await fetchWrapperStatic({
    url: `bundle/assignment-edit/${query.spec}`,
    req,
  });

  if (response.status === 200) {
    const response_json = await response.json();
    return {
      props: {
        assignment_schemas: response_json.schemas,
        groups: response_json.groups,
        assignment: response_json.assignment,
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
