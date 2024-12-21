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
import { ICourseAdd } from '@custom-types/data/ICourse';

interface ICourseAddBundle {}

const initialValues: ICourseAdd = {
  spec: '123',
  title: 'Тестовый курс',
  description: 'Тестовое описание',
  image: '',
  children: [
    {
      id: '124',
      kind: 'unit',
      title: 'Первый модуль',
      units: [
        { id: '135', kind: 'lesson', title: 'Урок 1.1', units: [] },
        { id: '136', kind: 'lesson', title: 'Урок 1.2', units: [] },
        { id: '137', kind: 'lesson', title: 'Урок 1.3', units: [] },
        { id: '138', kind: 'lesson', title: 'Урок 1.4', units: [] },
      ],
    },
    {
      id: '125',
      kind: 'unit',
      title: 'Второй модуль',
      units: [
        { id: '135', kind: 'lesson', title: 'Урок 2.1', units: [] },
        { id: '136', kind: 'lesson', title: 'Урок 2.2', units: [] },
        { id: '137', kind: 'lesson', title: 'Урок 2.3', units: [] },
        { id: '138', kind: 'lesson', title: 'Урок 2.4', units: [] },
      ],
    },
    {
      id: '126',
      kind: 'unit',
      title: 'Третий модуль',
      units: [
        { id: '135', kind: 'lesson', title: 'Урок 3.1', units: [] },
        { id: '136', kind: 'lesson', title: 'Урок 3.2', units: [] },
        { id: '137', kind: 'lesson', title: 'Урок 3.3', units: [] },
        { id: '138', kind: 'lesson', title: 'Урок 3.4', units: [] },
      ],
    },
    {
      id: '127',
      kind: 'unit',
      title: 'Четвертый модуль',
      units: [
        { id: '135', kind: 'lesson', title: 'Урок 4.1', units: [] },
        { id: '136', kind: 'lesson', title: 'Урок 4.2', units: [] },
        { id: '137', kind: 'lesson', title: 'Урок 4.3', units: [] },
        { id: '138', kind: 'lesson', title: 'Урок 4.4', units: [] },
      ],
    },
  ],
};

function CourseAdd(props: ICourseAddBundle) {
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

      const course = {
        ...form.values,
      };

      console.log('course from form', course);

      // requestWithNotify<ICourseAdd, string>(
      //   'course/add',
      //   'POST',
      //   locale.notify.course.create,
      //   lang,
      //   (response) => response,
      //   course
      // );
    },
    [lang, locale, user?.login]
  );

  return (
    <>
      <Title title={locale.titles.course.add} />
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

CourseAdd.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CourseAdd;

export const getServerSideProps: GetServerSideProps = async ({
  query: _,
  req,
}) => {
  return {
    props: {},
  };
  // const response = await fetchWrapperStatic({
  //   url: 'bundle/course-add',
  //   req,
  // });

  // if (response.status === 200) {
  //   const response_json = await response.json();
  //   return {
  //     props: {
  //       course_schemas: response_json.schemas,
  //       groups: response_json.groups,
  //     },
  //   };
  // }
  // return {
  //   redirect: {
  //     permanent: false,
  //     destination: '/404',
  //   },
  // };
};
