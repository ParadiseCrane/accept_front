import { IAssessmentType } from '@custom-types/data/atomic';
import { ISecurity } from '@custom-types/data/ITournament';
import { IUserDisplay } from '@custom-types/data/IUser';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { UseFormReturnType, useForm } from '@mantine/form';
import Stepper from '@ui/Stepper/Stepper';
import { UTCDate } from '@utils/datetime';
import { FC, memo, useEffect } from 'react';

import AdditionalInfo from './AdditionalInfo/AdditionalInfo';
import Dates from './Dates/Dates';
import MainInfo from './MainInfo/MainInfo';
import Moderators from './Moderators/Moderators';
import Preview from './Preview/Preview';
import TaskOrdering from './TaskOrdering/TaskOrdering';

const stepFields: string[][] = [
  ['title', 'description', 'tags', 'public'],
  [
    'assessmentType',
    'security',
    'allowRegistrationAfterStart',
    'shouldPenalizeAttempt',
  ],
  ['start', 'end', 'frozeResults'],
  [], // task ordering
  ['moderators'],
  [], // preview
];

const Form: FC<{
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: any;
  buttonLabel: string;
  assessmentTypes: IAssessmentType[];
  securities: ISecurity[];
  users: IUserDisplay[];
}> = ({
  handleSubmit,
  initialValues,
  buttonLabel,
  assessmentTypes,
  securities,
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
        value.length < 5 ? locale.tournament.form.validation.title : null,
      description: (value) =>
        value.length < 20
          ? locale.tournament.form.validation.description
          : null,
      start: (value) =>
        !value ? locale.tournament.form.validation.startDate : null,
      end: (value, values) =>
        !value
          ? locale.tournament.form.validation.endDate
          : !!values.start && values.start >= value
            ? locale.tournament.form.validation.date
            : null,
      frozeResults: (value, values) =>
        !!values.start && value < values.start
          ? locale.tournament.form.validation.frozeDateStart
          : !!values.end && value > values.end
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
            initialMaxTeamSize={initialValues.maxTeamSize}
          />,
          <AdditionalInfo
            key={'1'}
            form={form}
            assessmentTypes={assessmentTypes}
            securities={securities}
          />,
          <Dates key={'2'} form={form} />,
          <TaskOrdering key={'3'} form={form} />,
          <Moderators key={'4'} form={form} users={users} />,
          <Preview
            key={'5'}
            tournament={{
              ...form.values,
              start: UTCDate(form.values.start),
              end: UTCDate(form.values.end),
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
