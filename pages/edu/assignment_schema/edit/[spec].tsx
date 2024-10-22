import { useLocale } from '@hooks/useLocale';
import { ReactNode, useCallback, useMemo } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { ITaskDisplay } from '@custom-types/data/ITask';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { Item } from '@custom-types/ui/atomic';
import { IAssignmentSchema } from '@custom-types/data/IAssignmentSchema';
import Form from '@components/AssignmentSchema/Form/Form';
import { requestWithNotify } from '@utils/requestWithNotify';
import { GetServerSideProps } from 'next';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import Title from '@ui/Title/Title';
import { fetchWrapperStatic } from '@utils/fetchWrapper';

function EditAssignmentSchema({
  assignment_schema,
}: {
  assignment_schema: IAssignmentSchema;
}) {
  const { locale, lang } = useLocale();

  const formValues = useMemo(
    () => ({
      ...assignment_schema,
      author: assignment_schema.author,
      tags: assignment_schema.tags.map((tag) => ({
        label: tag.title,
        value: tag.spec,
      })),
      tasks: assignment_schema.tasks.map((task: ITaskDisplay) => ({
        label: task?.title,
        value: task?.spec,
      })),
    }),
    [assignment_schema]
  );

  const handleSubmit = useCallback(
    (form: UseFormReturnType<any>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.validationError,
          autoClose: 5000,
        });
        return;
      }
      let body: any = {
        ...form.values,
        tasks: form.values['tasks'].map((task: Item) => task.value),
        tags: form.values['tags'].map((tag: Item) => tag.value),
      };
      requestWithNotify(
        `assignment_schema/edit`,
        'POST',
        locale.notify.assignmentSchema.edit,
        lang,
        (response: IAssignmentSchema) => response.spec,
        body
      );
    },
    [locale, lang]
  );

  return (
    <>
      <Title title={locale.titles.assignment_schema.edit} />
      <Form
        initialValues={formValues}
        handleSubmit={handleSubmit}
        buttonLabel={locale.form.update}
      />
    </>
  );
}

EditAssignmentSchema.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default EditAssignmentSchema;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  const assignmentSchemaResponse = await fetchWrapperStatic({
    url: `assignment_schema/${query.spec}`,
    req,
  });

  if (assignmentSchemaResponse.status === 200) {
    const assignmentSchema: IAssignmentSchema =
      await assignmentSchemaResponse.json();
    return {
      props: {
        assignment_schema: assignmentSchema,
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
