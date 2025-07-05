import { IAssessmentType } from '@custom-types/data/atomic';
import { Item } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { CustomEditor, Radio, TextInput } from '@ui/basics';
import { TagSelector } from '@ui/selectors';
import { FC, memo, useCallback, useMemo } from 'react';

const MainInfo: FC<{
  form: any;
}> = ({ form }) => {
  const { locale } = useLocale();

  const initialTags = useMemo(
    () => {
      return form.values.tags;
    },
    [form.values.tags.length] // eslint-disable-line
  );

  const setUsed = useCallback(
    (value: Item[]) => form.setFieldValue('tags', value),
    [form.setFieldValue] // eslint-disable-line
  );

  const assessmentTypeItems = useMemo(
    () =>
      form.values.assessmentTypes.map((assessmentType: IAssessmentType) => ({
        value: assessmentType.spec.toString(),
        label:
          locale.tournament.form.assessmentType.variants[assessmentType.spec],
      })),
    [locale, form]
  );

  const handlerAssessmentType = useCallback(
    (value: string) => {
      form.setFieldValue('assessmentType', value);
    },
    [form]
  );

  return (
    <>
      <TextInput
        size="lg"
        label={locale.course.lesson.form.title}
        required
        {...form.getInputProps('title')}
      />
      <CustomEditor
        label={locale.course.lesson.form.description}
        form={form}
        name={'description'}
      />
      <TagSelector
        initialTags={initialTags}
        setUsed={setUsed}
        // TODO mocked method
        // fetchURL={'lesson_tag/list'}
        // addURL={'lesson_tag/add'}
        // updateURL={'lesson_tag/edit'}
        // deleteURL={'lesson_tag/delete'}
        fetchURL={'tournament_tag/list'}
        addURL={'tournament_tag/add'}
        updateURL={'tournament_tag/edit'}
        deleteURL={'tournament_tag/delete'}
        form={form}
        field={'tags'}
        width="80%"
      />
      <Radio
        label={locale.tournament.form.assessmentType.title}
        field={'assessmentType'}
        form={form}
        items={assessmentTypeItems}
        onChange={handlerAssessmentType}
      />
    </>
  );
};

export default memo(MainInfo);
