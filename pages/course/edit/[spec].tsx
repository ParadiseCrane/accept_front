import Form from '@components/Course/Form/Form';
import { Wrapper } from '@components/Course/Wrapper/Wrapper';
import {
  ICourseAddEdit,
  ICourseModel,
  IUnit,
} from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { UseFormReturnType } from '@mantine/form/lib/types';
import Title from '@ui/Title/Title';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { GetServerSideProps } from 'next';
import { ReactNode, useCallback } from 'react';

const getInitialValuesCourse = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: IUnit[];
}): ICourseAddEdit => {
  return {
    title: title,
    description: description,
    kind: 'course',
    image: '768a33f5-e38c-4ac5-a61d-822c6f68f5dd',
    children: children,
  };
};

const getInitialValuesUnit = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: IUnit[];
}): ICourseAddEdit => {
  return {
    title: title,
    description: description,
    kind: 'course',
    image: '768a33f5-e38c-4ac5-a61d-822c6f68f5dd',
    children: children,
  };
};

function CourseEdit(props: { course: ICourseModel }) {
  const { locale, lang } = useLocale();
  const { user } = useUser();
  const initialValues = getInitialValuesCourse({
    title: props.course.title,
    description: props.course.description,
    children: props.course.children,
  });
  console.log('initialValues', initialValues);

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

      const courseToSend: ICourseAddEdit = {
        ...course,
        children: emptyChildren,
        kind: 'course',
      };
      console.log('courseToSend', courseToSend);

      requestWithNotify<ICourseAddEdit, string>(
        `course/put/${props.course.spec}`,
        'PUT',
        locale.notify.course.edit,
        lang,
        (response) => response,
        courseToSend
      );
    },
    [lang, locale, user?.login]
  );

  return (
    <Wrapper>
      <Title title={locale.titles.course.edit} />
      <Form
        shouldNotify={true}
        handleSubmit={handleSubmit}
        buttonLabel={locale.create}
        initialValues={initialValues}
        editMode={true}
        {...props}
      />
    </Wrapper>
  );
}

CourseEdit.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CourseEdit;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec || Array.isArray(query.spec)) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }

  const response = await fetchWrapperStatic({
    url: `course-edit/${query.spec}`,
    req,
  });

  if (response.status === 200) {
    const json = await response.json();
    const course = {
      ...json,
      spec: query.spec,
    };

    return {
      props: {
        course,
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
