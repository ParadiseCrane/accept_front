import { FC, memo, useCallback, useState } from 'react';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { Button } from '@ui/basics';
import { setter } from '@custom-types/ui/atomic';
import stepperStyles from '@styles/ui/stepper.module.css';
import TestArea from '@ui/TestArea/TestArea';
import styles from './addModal.module.css';
import { useLocale } from '@hooks/useLocale';
import { useForm } from '@mantine/form';
import { ITaskTestData } from '@custom-types/data/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';

const MAX_TEXT_LENGTH = 100_000;

const AddModal: FC<{
  task_spec: string;
  refetch: setter<boolean>;
  hideInput: boolean;
  hideOutput: boolean;
}> = ({ task_spec, refetch, hideInput, hideOutput }) => {
  const { locale, lang } = useLocale();
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
          : value.length > MAX_TEXT_LENGTH
          ? locale.task.form.validation.testField.tooLong
          : null,
      outputData: (value) =>
        hideOutput
          ? null
          : value.length == 0
          ? locale.task.form.validation.testField.empty
          : value.length > MAX_TEXT_LENGTH
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

    requestWithNotify<ITaskTestData[], boolean>(
      `task_test/post/${task_spec}`,
      'POST',
      locale.notify.task_test.post,
      lang,
      () => '',
      body,
      (response) => {
        if (response) {
          setOpened(false);
          refetch(false);
        }
      }
    );
  }, [form, refetch, task_spec, lang, locale]);

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
        +
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
                  console.log('validate!');
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
