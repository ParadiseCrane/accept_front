'use client';
import { ILesson, ILessonEditBundle } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import Title from '@ui/Title/Title';
import { memo, useMemo } from 'react';
import Form from './LessonEditForm/Form';
import { useRequest } from '@hooks/useRequest';
import { LoadingOverlay } from '@ui/basics';

function LessonEditPage(props: { course: ILesson; depth: number }) {
  const { locale } = useLocale();
  const { data, loading } = useRequest<{}, ILessonEditBundle>(
    `lesson/bundle/lesson_edit/${props.course.spec}`,
    'GET'
  );

  const initialValues = useMemo(() => {
    if (data) {
      return {
        title: data.lesson.title,
        description: data.lesson.description,
        tags: data.tags,
        assessmentTypes: data.assessmentTypes,
        assessmentType: '',
        allowedLanguages: data.lesson.allowedLanguages.map((lang) => ({
          value: lang.spec.toString(),
          name: lang.name,
        })),
        forbiddenLanguages: data.lesson.forbiddenLanguages.map((lang) => ({
          value: lang.spec.toString(),
          name: lang.name,
        })),
      };
    }
  }, [data]);

  if (loading || !data) return <LoadingOverlay />;

  return (
    <>
      <Title title={locale.titles.course.edit} />
      <Form
        handleSubmit={(form) => {
          form.validate();
          console.log('handleSubmit', form.values);
        }}
        initialValues={initialValues}
        buttonLabel={locale.edit}
        assessmentTypes={data.assessmentTypes}
      />
    </>
  );
}

export default memo(LessonEditPage);
