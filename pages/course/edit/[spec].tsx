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
import { useSearchParams } from 'next/navigation';
import { ReactNode, useCallback } from 'react';

const getInitialValuesCourse = ({
  title,
  description,
  children,
  image,
  kind,
}: {
  title: string;
  description: string;
  children: IUnit[];
  image: string;
  kind: 'unit' | 'course';
}): ICourseAddEdit => {
  return {
    title,
    description,
    kind,
    image,
    children,
  };
};

function CourseEdit(props: { course: ICourseModel; depth: number }) {
  const { locale, lang } = useLocale();
  const { user } = useUser();
  const initialValues = getInitialValuesCourse({
    title: props.course.title,
    description: props.course.description,
    children: props.course.children ?? [],
    image: props.course.image,
    kind: props.course.kind,
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

      const courseToSend: ICourseAddEdit = {
        ...course,
        children: emptyChildren,
        kind: 'course',
      };

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

  const isUnitEdit = req.url?.includes('?unit=');
  const url = isUnitEdit
    ? req.url?.split('?unit=').pop()!.split('&spec')[0]
    : query.spec;

  const response = await fetchWrapperStatic({
    url: `course-edit/${url}`,
    req,
  });

  if (response.status === 200) {
    const json = await response.json();
    const course = {
      ...json.course,
      spec: query.spec,
    };

    return {
      props: {
        course,
        depth: json.depth,
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
