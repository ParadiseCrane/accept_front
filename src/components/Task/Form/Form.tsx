import Checker from '@components/Task/Form/Checker/Checker';
import ConstraintsInfo from '@components/Task/Form/ConstraintsInfo/ConstraintsInfo';
import DescriptionInfo from '@components/Task/Form/DescriptionInfo/DescriptionInfo';
import Examples from '@components/Task/Form/Examples/Examples';
import MainInfo from '@components/Task/Form/MainInfo/MainInfo';
import Preview from '@components/Task/Form/Preview/Preview';
import Tests from '@components/Task/Form/Tests/Tests';
import {
  IHintAlarmType,
  ITaskCheckType,
  ITaskTestData,
  ITaskType,
} from '@custom-types/data/atomic';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { UseFormReturnType, useForm } from '@mantine/form';
import Stepper from '@ui/Stepper/Stepper';
import { FC, memo, useEffect } from 'react';

const stepFields = [
  ['title', 'tags', 'complexity', 'taskType', 'checkType', 'hasHint'],
  [
    'shouldRestrictLanguages',
    'allowedLanguages',
    'forbiddenLanguages',
    'constraintsTime',
    'constraintsMemory',
  ],
  [
    'description',
    'inputFormat',
    'outputFormat',
    'remark',
    'hintAlarm',
    'hintContent',
  ],
  ['examples'],
  ['checkerLang', 'checkerCode'],
  [],
];

const Form: FC<{
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: any;
  buttonLabel: string;
  taskTypes: ITaskType[];
  taskCheckTypes: ITaskCheckType[];
  hintAlarmTypes: IHintAlarmType[];
}> = ({
  handleSubmit,
  buttonLabel,
  taskTypes,
  taskCheckTypes,
  hintAlarmTypes,
  initialValues,
}) => {
  const { locale } = useLocale();

  const form = useForm({
    initialValues,
    validate: {
      title: (value) =>
        value.length < 5 ? locale.task.form.validation.title : null,
      tags: (value) =>
        value.length < 1 ? locale.task.form.validation.tags : null,
      description: (value) =>
        value.length < 20 ? locale.task.form.validation.description : null,
      inputFormat: (value) =>
        value.length == 0 ? locale.task.form.validation.inputFormat : null,
      outputFormat: (value) =>
        value.length == 0 ? locale.task.form.validation.outputFormat : null,
      constraintsMemory: (value) =>
        value < 0 || value > 1024
          ? locale.task.form.validation.constraints.memory
          : null,
      constraintsTime: (value) =>
        value < 0.5 || value > 30
          ? locale.task.form.validation.constraints.time
          : null,
      complexity: (value) =>
        value <= 0
          ? locale.task.form.validation.complexity.least
          : value > 100
            ? locale.task.form.validation.complexity.most
            : null,
      examples: (value) =>
        value.length < 1
          ? locale.task.form.validation.examples.number
          : value.filter(
                (pair: ITaskTestData) =>
                  pair.inputData.trim() || pair.outputData.trim()
              ).length != value.length
            ? locale.task.form.validation.examples.empty
            : null,
      checkerCode: (value, values) =>
        values.checkType == '1' && value.length == 0
          ? locale.task.form.validation.checkerCode
          : null,
      hintContent: (value, values) =>
        values.hasHint
          ? value.length == 0
            ? locale.task.form.validation.hintContent
            : null
          : null,
      hintAlarm: (value, values) =>
        values.hasHint
          ? value < 0
            ? locale.task.form.validation.hintAlarm
            : null
          : null,
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    form.setValues(initialValues);
  }, [initialValues]); //eslint-disable-line

  return (
    <Stepper
      buttonLabel={buttonLabel}
      form={form}
      handleSubmit={() => handleSubmit(form)}
      stepFields={stepFields}
      pages={[
        <MainInfo
          key="0"
          form={form}
          taskTypes={taskTypes}
          taskCheckTypes={taskCheckTypes}
        />,
        form.values.taskType == 0 ? (
          <ConstraintsInfo key="1" form={form} />
        ) : (
          <>{locale.task.form.steps.emptyStep}</>
        ),
        <DescriptionInfo key="2" form={form} hintAlarmTypes={hintAlarmTypes} />,
        <Examples key="3" form={form} />,
        <>
          {form.values.checkType === '0' ? (
            <Tests key="4" />
          ) : (
            <Checker key="4" form={form} />
          )}
        </>,
        <Preview key="5" form={form} />,
      ]}
      labels={locale.task.form.steps.labels}
      descriptions={locale.task.form.steps.descriptions}
    />
  );
};

export default memo(Form);
