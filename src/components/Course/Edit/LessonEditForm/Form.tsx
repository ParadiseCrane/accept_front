import { IAssessmentType } from '@custom-types/data/atomic';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { UseFormReturnType, useForm } from '@mantine/form';
import Stepper from '@ui/Stepper/Stepper';
import { FC, memo, useEffect } from 'react';

import MainInfo from './MainInfo/MainInfo';
import LanguageRestriction from './LanguageConstraints/LanguageRestriction';

const stepFields: string[][] = [
  ['title', 'description', 'tags', 'assessmentType'],
  ['shouldRestrictLanguages', 'allowedLanguages', 'forbiddenLanguages'],
];

const Form: FC<{
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: any;
  buttonLabel: string;
  assessmentTypes: IAssessmentType[];
}> = ({ handleSubmit, initialValues, buttonLabel }) => {
  const { locale } = useLocale();

  useEffect(() => {
    form.setValues(initialValues);
  }, [initialValues]); //eslint-disable-line

  const form = useForm({
    initialValues,
    validate: {
      title: (value) =>
        value.length < 5 ? locale.course.lesson.form.validation.title : null,
      description: (value) =>
        value.length < 20
          ? locale.course.lesson.form.validation.description
          : null,
      assessmentType: (value) =>
        value.length === 0
          ? locale.course.lesson.form.validation.assessmentType
          : null,
    },
    validateInputOnBlur: true,
  });

  return (
    <>
      <Stepper
        buttonLabel={buttonLabel}
        form={form}
        handleSubmit={() => handleSubmit(form)}
        stepFields={stepFields}
        pages={[
          <MainInfo key={'0'} form={form} />,
          <LanguageRestriction key={'1'} form={form} />,
        ]}
        labels={locale.course.lesson.form.labels}
        descriptions={locale.course.lesson.form.descriptions}
      />
    </>
  );
};

export default memo(Form);
