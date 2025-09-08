'use client';
import CourseForm from '@components/Course/Form/CourseForm';
import { Wrapper } from '@components/Course/Wrapper/Wrapper';
import { ICourseAddEdit, IBaseTreeUnit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { UseFormReturnType } from '@mantine/form/lib/types';
import Title from '@ui/Title/Title';
import { courseFormUtils } from '@utils/courseFormUtils';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useRouter } from 'next/router';
import { ReactNode, useCallback } from 'react';

function CourseAdd() {
  const { locale, lang } = useLocale();
  const { user } = useUser();
  const initialValues = courseFormUtils.getInitialValuesAddCourse({
    title: locale.ui.courseTree.title,
  });
  const router = useRouter();

  const handleSubmit = useCallback(
    (form: UseFormReturnType<typeof initialValues>) => {
      if (
        courseFormUtils.checkCourseImageInvalidInput({
          image: form.values.image,
          locale,
        }) ||
        courseFormUtils.checkCourseTitleInvalidInput({
          title: form.values.title.trim(),
          locale,
        }) ||
        courseFormUtils.checkCourseDescriptionInvalidInput({
          description: form.values.description,
          locale,
        }) ||
        courseFormUtils.checkChildrenInvalidInput({
          children: form.values.children,
          locale,
        }) ||
        courseFormUtils.checkFormValidation({
          value: form.validate().hasErrors,
          locale,
        })
      )
        return;

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

      const courseToSend = { ...course, children: emptyChildren };

      requestWithNotify<ICourseAddEdit, string>(
        'course/add',
        'POST',
        locale.notify.course.create,
        lang,
        (response) => response,
        courseToSend
      ).then((res) => {
        if (!res.error) {
          router.push('/courses');
        }
      });
    },
    [lang, locale, router]
  );

  return (
    <Wrapper>
      <Title title={locale.titles.course.add} />
      <CourseForm
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        editMode={false}
        depth={0}
      />
    </Wrapper>
  );
}

CourseAdd.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CourseAdd;
