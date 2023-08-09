import { useLocale } from '@hooks/useLocale';
import { FC, memo, useEffect } from 'react';
import { callback } from '@custom-types/ui/atomic';
import { IAssignmentSchemaDisplay } from '@custom-types/data/IAssignmentSchema';
import { IGroup } from '@custom-types/data/IGroup';
import MainInfo from './MainInfo/MainInfo';
import Groups from './Groups/Groups';
import Origin from './Origin/Origin';
import Stepper from '@ui/Stepper/Stepper';
import { UseFormReturnType, useForm } from '@mantine/form';

const stepFields = [
  ['startDate', 'startTime', 'endDate', 'endTime', 'dates'],
  ['groups'],
  [
    'origin',
    'notificationTitle',
    'notificationDescription',
    'notificationShortDescription',
  ],
];

const Form: FC<{
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: any;
  buttonLabel: string;
  groups: IGroup[];
  shouldNotify: boolean;
  assignment_schemas: IAssignmentSchemaDisplay[];
}> = ({
  handleSubmit,
  initialValues,
  buttonLabel,
  groups,
  assignment_schemas,
  shouldNotify,
}) => {
  const { locale } = useLocale();

  useEffect(() => {
    form.setValues(initialValues);
  }, [initialValues]); //eslint-disable-line

  const form = useForm({
    initialValues,
    validate: {
      origin: (value) =>
        value.length == 0
          ? locale.assignment.form.validation.origin
          : null,
      startDate: (value) =>
        !value ? locale.assignment.form.validation.startDate : null,
      endDate: (value, values) =>
        values.infinite
          ? null
          : !value
          ? locale.assignment.form.validation.endDate
          : !!values.startDate && values.startDate >= value
          ? locale.assignment.form.validation.date
          : null,
      groups: (value) =>
        value.length == 0
          ? locale.assignment.form.validation.groups
          : null,

      notificationTitle: (value) =>
        shouldNotify && value.length == 0
          ? locale.notification.form.validate.title
          : null,

      notificationShortDescription: () => null,
      notificationDescription: () => null,
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
          <MainInfo key={0} form={form} />,
          <Groups key={1} form={form} groups={groups} />,
          <Origin
            key={2}
            form={form}
            shouldNotify={shouldNotify}
            assignmentSchemas={assignment_schemas}
          />,
        ]}
        labels={locale.assignment.form.steps.labels}
        descriptions={locale.assignment.form.steps.descriptions}
      />
    </>
  );
};

export default memo(Form);
