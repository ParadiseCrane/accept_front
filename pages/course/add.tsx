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
import { ILocaleContext } from '@custom-types/ui/ILocale';

interface ICourseAddBundle {}

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
    image: '',
    children: [],
  };
};

function CourseAdd(props: ICourseAddBundle) {
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
