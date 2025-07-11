'use client';
import { Wrapper } from '@components/Course/Wrapper/Wrapper';
import { IBaseTreeUnit, IUnit, IUnitAddEdit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { UseFormReturnType } from '@mantine/form/lib/types';
import Title from '@ui/Title/Title';
import { courseFormUtils } from '@utils/courseFormUtils';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useRouter } from 'next/router';
import { memo, useCallback } from 'react';
import UnitForm from '../Form/UnitForm';

function UnitEditPage(props: { course: IUnit; depth: number }) {
  const { locale, lang } = useLocale();
  const { user } = useUser();
  const initialValues = courseFormUtils.getInitialValuesEditUnit({
    title: props.course.title,
    description: props.course.description,
    children: props.course.children ?? [],
    kind: props.course.kind,
  });

  const router = useRouter();

  const handleSubmit = useCallback(
    (form: UseFormReturnType<typeof initialValues>) => {
      if (
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

      const course: IUnitAddEdit = {
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

      const courseToSend: IUnitAddEdit = {
        ...course,
        children: emptyChildren,
        kind: props.course.kind,
      };

      requestWithNotify<IUnitAddEdit, string>(
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
    },
    [lang, locale, router, props]
  );

  return (
    <Wrapper>
      <Title title={locale.titles.course.edit} />
      <UnitForm
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        editMode={true}
        {...props}
      />
    </Wrapper>
  );
}

export default memo(UnitEditPage);
