import { Wrapper } from '@components/Course/Wrapper/Wrapper';
import {
  ICourseAddEdit,
  IBaseTreeUnit,
  IUnit,
  IUnitAddEdit,
  ILesson,
} from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { UseFormReturnType } from '@mantine/form/lib/types';
import Title from '@ui/Title/Title';
import { courseFormUtils } from '@utils/courseFormUtils';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useRouter } from 'next/router';
import { memo, useCallback } from 'react';
import UnitForm from '../Form/UnitForm';
import LessonForm from '../Form/LessonForm';

function LessonEditPage(props: { course: ILesson; depth: number }) {
  const { locale } = useLocale();
  // const { user } = useUser();
  // const initialValues = courseFormUtils.getInitialValuesEditUnit({
  //   title: props.course.title,
  //   description: props.course.description,
  //   children: props.course.children ?? [],
  //   kind: props.course.kind,
  // });

  // const router = useRouter();

  // const handleSubmit = useCallback(
  //   (form: UseFormReturnType<typeof initialValues>) => {
  //     if (
  //       courseFormUtils.checkCourseTitleInvalidInput({
  //         title: form.values.title.trim(),
  //         locale,
  //       }) ||
  //       courseFormUtils.checkCourseDescriptionInvalidInput({
  //         description: form.values.description,
  //         locale,
  //       }) ||
  //       courseFormUtils.checkChildrenInvalidInput({
  //         children: form.values.children,
  //         locale,
  //       }) ||
  //       courseFormUtils.checkFormValidation({
  //         value: form.validate().hasErrors,
  //         locale,
  //       })
  //     )
  //       return;

  //     const course: IUnitAddEdit = {
  //       ...form.values,
  //     };

  //     const children: IBaseTreeUnit[] = [...course.children];
  //     const emptyChildren: IBaseTreeUnit[] = [];
  //     for (let i = 0; i < children.length; i++) {
  //       if (children[i].spec.includes('newElement')) {
  //         emptyChildren.push({ ...children[i], spec: '' });
  //       } else {
  //         emptyChildren.push(children[i]);
  //       }
  //     }

  //     const courseToSend: IUnitAddEdit = {
  //       ...course,
  //       children: emptyChildren,
  //       kind: props.course.kind,
  //     };

  //     requestWithNotify<IUnitAddEdit, string>(
  //       `course/put/${props.course.spec}`,
  //       'PUT',
  //       locale.notify.course.edit,
  //       lang,
  //       (response) => response,
  //       courseToSend
  //     ).then((res) => {
  //       if (!res.error) {
  //         router.push('/courses');
  //       }
  //     });
  //   },
  //   [lang, locale, router, user?.login]
  // );

  return (
    <Wrapper>
      <Title title={locale.titles.course.edit} />
      <LessonForm />
    </Wrapper>
  );
}

export default memo(LessonEditPage);
