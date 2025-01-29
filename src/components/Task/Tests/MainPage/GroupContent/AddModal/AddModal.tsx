import { MAX_ANSWER_LENGTH, MAX_TEST_LENGTH } from '@constants/Limits';
import { ITaskTestData } from '@custom-types/data/atomic';
import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { useForm } from '@mantine/form';
import stepperStyles from '@styles/ui/stepper.module.css';
import { Button } from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import TestArea from '@ui/TestArea/TestArea';
import { FC, memo, useCallback, useState } from 'react';

import styles from './addModal.module.css';

const AddModal: FC<{
  addTests: setter<ITaskTestData[]>;
  label?: string;
  hideInput: boolean;
  hideOutput: boolean;
}> = ({ addTests, label = '+', hideInput, hideOutput }) => {
  const { locale } = useLocale();
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      inputData: '',
      outputData: '',
    } as ITaskTestData,
    validate: {
      inputData: (value) =>
        hideInput
          ? null
          : value.length == 0
            ? locale.task.form.validation.testField.empty
            : value.length > MAX_TEST_LENGTH
              ? locale.task.form.validation.testField.tooLong
              : null,
      outputData: (value) =>
        hideOutput
          ? null
          : value.length == 0
            ? locale.task.form.validation.testField.empty
            : value.length > MAX_TEST_LENGTH
              ? locale.task.form.validation.testField.tooLong
              : hideInput && value.length > MAX_ANSWER_LENGTH // Text task
                ? locale.task.form.validation.testField.tooLong
                : null,
    },
    validateInputOnBlur: true,
  });

  const onAdd = useCallback(() => {
    form.validate();
    if (!form.isValid()) return;

    let body = [
      {
        inputData: form.values.inputData,
        outputData: form.values.outputData,
      },
    ];

    addTests(body);
    setOpened(false);
  }, [form, addTests]);

  const onClose = useCallback(() => {
    setOpened(false);
  }, []);

  return (
    <div>
      <Button
        className={stepperStyles.addButton}
        variant="light"
        onClick={() => {
          setOpened(true);
        }}
      >
        {label}
      </Button>
      <SimpleModal
        opened={opened}
        size={'60%'}
        title={locale.task.tests.addTest}
        close={onClose}
        hideCloseButton
      >
        <div className={styles.contentWrapper}>
          <div className={styles.testFields}>
            {!hideInput && (
              <TestArea
                label={locale.task.form.inputTest}
                minRows={7}
                maxRows={7}
                validateField={() => form.validateField('inputData')}
                {...form.getInputProps('inputData')}
              />
            )}
            {!hideOutput && (
              <TestArea
                label={locale.task.form.outputTest}
                minRows={7}
                maxRows={7}
                validateField={() => {
                  form.validateField('outputData');
                }}
                {...form.getInputProps('outputData')}
              />
            )}
          </div>
          <SimpleButtonGroup
            actionButton={{
              label: locale.add,
              onClick: onAdd,
              props: { disabled: !form.isValid() },
            }}
            cancelButton={{
              label: locale.cancel,
              onClick: onClose,
            }}
          />
        </div>
      </SimpleModal>
    </div>
  );
};

export default memo(AddModal);
