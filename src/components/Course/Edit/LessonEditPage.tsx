'use client';
import {
  ILesson,
  ILessonEditBundle,
  ILessonEditSend,
} from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { memo, useCallback, useMemo, useState } from 'react';
import Form from './LessonEditForm/Form';
import { useRequest } from '@hooks/useRequest';
import { LoadingOverlay } from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';
import { UseFormReturnType } from '@mantine/form';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { useRouter } from 'next/navigation';
import { IAssessmentType } from '@custom-types/data/atomic';
import { Item } from '@custom-types/ui/atomic';

function LessonEditPage(props: { lesson: ILesson; depth: number }) {
  const { locale } = useLocale();
  const { data, loading } = useRequest<{}, ILessonEditBundle>(
    `lesson/bundle/lesson_edit/${props.lesson.spec}`,
    'GET'
  );
  const router = useRouter();
  const { lang } = useLocale();

  const initialValues = useMemo(() => {
    if (data) {
      return {
        title: data.lesson.title,
        description: data.lesson.description ?? '',
        tags: data.tags.map((tag) => ({
          display: tag.title,
          value: tag.spec,
        })),
        assessmentTypes: data.assessment_types,
        assessmentType: data.assessment_types[0].spec.toString(),
        // TODO mocked method
        // allowedLanguages: data.lesson.allowedLanguages.map((lang) => ({
        //   value: lang.spec.toString(),
        //   name: lang.name,
        // })),
        // forbiddenLanguages: data.lesson.forbiddenLanguages.map((lang) => ({
        //   value: lang.spec.toString(),
        //   name: lang.name,
        // })),
      };
    }
  }, [data]);

  const handleSubmit = useCallback(
    async (form: UseFormReturnType<typeof initialValues>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.group.courseConstructorValidation.image,
          autoClose: 1000,
        });
        return;
      }

      if (!data) return;

      const lessonToSend: ILessonEditSend = {
        spec: data.lesson.spec,
        title: form.values?.title ?? '',
        description: form.values?.description ?? '',
        tasks: data.lesson.tasks.map((e) => e.spec),
        tags: form.values?.tags.map((e) => e.value) ?? [],
      };

      requestWithNotify<ILessonEditSend, string>(
        'lesson/edit',
        'PUT',
        locale.notify.course.create,
        lang,
        (response) => response,
        lessonToSend,
        () => {},
        { autoClose: 8000 }
      ).then((res) => {
        if (!res.error) {
          router.push('/course/list');
        }
      });
    },
    [data, locale, lang, router]
  );

  if (loading || !data) return <LoadingOverlay />;

  return (
    <Form
      handleSubmit={handleSubmit}
      initialValues={initialValues}
      buttonLabel={locale.edit}
      assessmentTypes={data.assessment_types}
    />
  );
}

export default memo(LessonEditPage);
