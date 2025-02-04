import Form from '@components/Course/Form/Form';
import { Wrapper } from '@components/Course/Wrapper/Wrapper';
import { ICourseAddEdit, IUnit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { UseFormReturnType } from '@mantine/form/lib/types';
import Title from '@ui/Title/Title';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { GetServerSideProps } from 'next';
import { ReactNode, useCallback } from 'react';

const getInitialValues = ({
  title,
  description,
}: {
  title: string;
  description: string;
}): ICourseAddEdit => {
  return {
    title: title,
    description: description,
    kind: 'course',
    image: '',
    children: [],
  };
};

function CourseAdd() {
  const { locale, lang } = useLocale();
  const { user } = useUser();
  const initialValues = getInitialValues({
    title: locale.ui.courseTree.title,
    description: locale.ui.courseTree.description,
  });

  const handleSubmit = useCallback(
    (form: UseFormReturnType<typeof initialValues>) => {
      const errorCondition: boolean =
        form.validate().hasErrors ||
        form.values.description.length === 0 ||
        form.values.image.length === 0 ||
        form.values.title.length === 0;
      if (errorCondition) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.group.validation.error,
          autoClose: 500,
        });
        return;
      }

      const course: ICourseAddEdit = {
        ...form.values,
      };

      const children: IUnit[] = [...course.children];
      const emptyChildren: IUnit[] = [];
      for (let i = 0; i < children.length; i++) {
        if (children[i].spec.includes('newElement')) {
          emptyChildren.push({ ...children[i], spec: '' });
        } else {
          emptyChildren.push(children[i]);
        }
      }

      const courseToSend = { ...course, children: emptyChildren };

      requestWithNotify<ICourseAddEdit, string>(
        'course/add',
        'POST',
        locale.notify.course.create,
        lang,
        (response) => response,
        courseToSend
      );
    },
    [lang, locale, user?.login]
  );

  return (
    <Wrapper>
      <Title title={locale.titles.course.add} />
      <Form
        shouldNotify={true}
        handleSubmit={handleSubmit}
        buttonLabel={locale.create}
        initialValues={initialValues}
        editMode={false}
      />
    </Wrapper>
  );
}

CourseAdd.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CourseAdd;
