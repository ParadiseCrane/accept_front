import Form from '@components/Course/Form/Form';
import { Wrapper } from '@components/Course/Wrapper/Wrapper';
import {
  ICourseAddEdit,
  ICourse,
  IBaseTreeUnit,
  IUnit,
  ILesson,
} from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { UseFormReturnType } from '@mantine/form/lib/types';
import Title from '@ui/Title/Title';
import { courseFormUtils } from '@utils/courseFormUtils';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { requestWithNotify } from '@utils/requestWithNotify';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
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
  children: IBaseTreeUnit[];
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

function CourseEdit(props: { course: ICourse; depth: number }) {
  const { locale, lang } = useLocale();
  const { user } = useUser();
  const initialValues = getInitialValuesCourse({
    title: props.course.title,
    description: props.course.description,
    children: props.course.children ?? [],
    image: props.course.image,
    kind: props.course.kind,
  });
  const router = useRouter();

  const handleSubmit = useCallback(
    (form: UseFormReturnType<typeof initialValues>) => {
      // if (
      //   courseFormUtils.checkCourseImageInvalidInput({
      //     image: form.values.image,
      //     locale,
      //   })
      // ) {
      //   return;
      // }

      // if (
      //   courseFormUtils.checkCourseTitleInvalidInput({
      //     title: form.values.title.trim(),
      //     locale,
      //   })
      // ) {
      //   return;
      // }

      // if (
      //   courseFormUtils.checkCourseDescriptionInvalidInput({
      //     description: form.values.description,
      //     locale,
      //   })
      // ) {
      //   return;
      // }

      // if (
      //   courseFormUtils.checkChildrenInvalidInput({
      //     children: form.values.children,
      //     locale,
      //   })
      // ) {
      //   return;
      // }

      // if (
      //   courseFormUtils.checkFormValidation({
      //     value: form.validate().hasErrors,
      //     locale,
      //   })
      // ) {
      //   return;
      // }

      if (
        courseFormUtils.checkCourseImageInvalidInput({
          image: form.values.image,
          locale,
        }) &&
        courseFormUtils.checkCourseTitleInvalidInput({
          title: form.values.title.trim(),
          locale,
        }) &&
        courseFormUtils.checkCourseDescriptionInvalidInput({
          description: form.values.description,
          locale,
        }) &&
        courseFormUtils.checkChildrenInvalidInput({
          children: form.values.children,
          locale,
        }) &&
        courseFormUtils.checkFormValidation({
          value: form.validate().hasErrors,
          locale,
        })
      ) {
        const course: ICourseAddEdit = {
          ...form.values,
        };

        const children: IBaseTreeUnit[] = [...course.children];
        const emptyChildren: IBaseTreeUnit[] = [];
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
          kind: props.course.kind,
        };

        requestWithNotify<ICourseAddEdit, string>(
          `course/put/${props.course.spec}`,
          'PUT',
          locale.notify.course.edit,
          lang,
          (response) => response,
          courseToSend
        ).then((res) => {
          if (!res.error) {
            router.push('/courses');
          }
        });
      }
    },
    [lang, locale, router, user?.login]
  );

  return (
    <Wrapper>
      <Title title={locale.titles.course.edit} />
      <Form
        handleSubmit={handleSubmit}
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
      notFound: true,
    };
  }

  const response = await fetchWrapperStatic({
    url: `course-edit/${req.url?.split('?item=').pop()!.split('&spec')[0]}`,
    req,
  });

  if (response.status === 200) {
    const entity: { course: ICourse | IUnit | ILesson; depth: number } =
      await response.json();

    return {
      props: entity,
    };
  }
  return {
    notFound: true,
  };
};
