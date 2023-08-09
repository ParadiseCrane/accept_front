import { FC, memo, useEffect } from 'react';
import { useLocale } from '@hooks/useLocale';
import { callback } from '@custom-types/ui/atomic';
import Stepper from '@ui/Stepper/Stepper';
import { UseFormReturnType, useForm } from '@mantine/form';
import MainInfo from './MainInfo/MainInfo';
import { IAssessmentType } from '@custom-types/data/atomic';
import { IUserDisplay } from '@custom-types/data/IUser';
import Dates from './Dates/Dates';
import TaskOrdering from './TaskOrdering/TaskOrdering';
import Moderators from './Moderators/Moderators';
import Preview from './Preview/Preview';

const stepFields: string[][] = [
  [
    'title',
    'description',
    'tags',
    'assessmentType',
    'allowRegistrationAfterStart',
    'shouldPenalizeAttempt',
  ],
  ['startDate', 'endDate', 'frozeResults'],
  [], // task ordering
  ['moderators'],
  [], // preview
];

const Form: FC<{
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: any;
  buttonLabel: string;
  assessmentTypes: IAssessmentType[];
  users: IUserDisplay[];
}> = ({
  handleSubmit,
  initialValues,
  buttonLabel,
  assessmentTypes,
  users,
}) => {
  const { locale } = useLocale();

  useEffect(() => {
    form.setValues(initialValues);
  }, [initialValues]); //eslint-disable-line

  const form = useForm({
    initialValues,
    validate: {
      title: (value) =>
        value.length < 5
          ? locale.tournament.form.validation.title
          : null,
      description: (value) =>
        value.length < 20
          ? locale.tournament.form.validation.description
          : null,
      startDate: (value) =>
        !value ? locale.tournament.form.validation.startDate : null,
      endDate: (value, values) =>
        !value
          ? locale.tournament.form.validation.endDate
          : !!values.startDate && values.startDate >= value
          ? locale.tournament.form.validation.date
          : null,
      frozeResults: (value, values) =>
        !!values.startDate && value < values.startDate
          ? locale.tournament.form.validation.frozeDateStart
          : !!values.endDate && value > values.endDate
          ? locale.tournament.form.validation.frozeDateEnd
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
          <MainInfo
            key={'0'}
            form={form}
            assessmentTypes={assessmentTypes}
          />,
          <Dates key={'1'} form={form} />,
          <TaskOrdering key={'2'} form={form} />,
          <Moderators key={'3'} form={form} users={users} />,
          <Preview
            key={'4'}
            tournament={{
              ...form.values,
              start: form.values.startDate,
              end: form.values.endDate,
            }}
          />,
        ]}
        labels={locale.tournament.form.steps.labels}
        descriptions={locale.tournament.form.steps.descriptions}
      />
    </>
  );
};

export default memo(Form);
