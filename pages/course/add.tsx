import { ReactNode, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Form from '@components/Course/Form/Form';
import { useLocale } from '@hooks/useLocale';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useUser } from '@hooks/useUser';
import { UseFormReturnType } from '@mantine/form/lib/types';
import Title from '@ui/Title/Title';
import { ICourseAdd, IUnit } from '@custom-types/data/ICourse';
import { Wrapper } from '@components/Course/Wrapper/Wrapper';

const getInitialValues = ({
  title,
  description,
}: {
  title: string;
  description: string;
}): ICourseAdd => {
  return {
    title: title,
    description: description,
    kind: 'course',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Himalayas%2C_Ama_Dablam%2C_Nepal.jpg/1280px-Himalayas%2C_Ama_Dablam%2C_Nepal.jpg',
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
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.group.validation.error,
          autoClose: 500,
        });
        return;
      }

      const course: ICourseAdd = {
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

      requestWithNotify<ICourseAdd, string>(
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
