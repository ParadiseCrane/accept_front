import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { useForm } from '@mantine/form';
import { ReactNode, useCallback } from 'react';
import { useUser } from '@hooks/useUser';
import Form from '@components/AssignmentSchema/Form/Form';

import { IAssignmentSchema } from '@custom-types/data/IAssignmentSchema';
import { Item } from '@ui/CustomTransferList/CustomTransferList';
import { requestWithNotify } from '@utils/requestWithNotify';


const initialValues = {
  spec: '',
  title: 'Уроки французского',
  author: '',
  tasks: [],
  taskNumber: 0,
  defaultDuration: 40, // minutes
  tags: [],
};

function AddAssignmentSchema() {
  const { locale, lang } = useLocale();
  const { user } = useUser();

  const form = useForm({
    initialValues,
  });

  const handleSubmit = useCallback(() => {
    let body: any = {
      ...form.values,
      author: user?.login || '',
      tasks: form.values['tasks'].map((task: Item) => task.value),
      taskNumber: form.values['tasks'].length,
      defaultDuration: form.values.defaultDuration * 60 * 1000, // from minutes to milliseconds
      tags: form.values['tags'].map((tag: Item) => tag.value),
    };
    requestWithNotify(
      'assignment_schema/add',
      'POST',
      locale.notify.assignmentSchema.create,
      lang,
      (response: IAssignmentSchema) => response.spec,
      body
    );
  }, [form.values, user?.login, locale, lang]);

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSubmit}
        buttonLabel={locale.form.create}
      />
    </>
  );
}

AddAssignmentSchema.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AddAssignmentSchema;
