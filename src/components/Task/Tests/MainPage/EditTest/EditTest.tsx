import { FC, memo, useCallback, useState } from 'react';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { setter } from '@custom-types/ui/atomic';
import TestArea from '@ui/TestArea/TestArea';
import styles from './editTest.module.css';
import { useLocale } from '@hooks/useLocale';
import { useForm } from '@mantine/form';
import { ITaskTestData } from '@custom-types/data/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';
import { Icon } from '@ui/basics';
import { Pencil } from 'tabler-icons-react';

const MAX_TEXT_LENGTH = 100_000;

const EditTest: FC<{
  test: ITruncatedTaskTest;
  refetch: setter<boolean>;
  hideInput: boolean;
  hideOutput: boolean;
}> = ({ refetch, test, hideInput, hideOutput }) => {
  const { locale, lang } = useLocale();
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: {
      inputData: test.inputData,
      outputData: test.outputData,
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

  const onEdit = useCallback(() => {
    form.validate();
    if (!form.isValid()) return;

    let body = {
      inputData: form.values.inputData,
      outputData: form.values.outputData,
    };
    requestWithNotify<ITaskTestData, boolean>(
      `task_test/put/${test.spec}`,
      'PUT',
      locale.notify.task_test.put,
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
  }, [form, refetch, test, lang, locale]);

  const onClose = useCallback(() => {
    setOpened(false);
  }, []);

  return (
    <>
      <Icon
        onClick={() => setOpened(true)}
        variant="transparent"
        size="xs"
        tooltipLabel={locale.ui.taskTest.edit}
      >
        <Pencil color="var(--primary)" />
      </Icon>
      <SimpleModal
        opened={opened}
        size={'60%'}
        title={locale.task.tests.editTest}
        close={onClose}
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
              label: locale.edit,
              onClick: onEdit,
              props: { disabled: !form.isValid() },
            }}
            cancelButton={{
              label: locale.cancel,
              onClick: onClose,
            }}
          />
        </div>
      </SimpleModal>
    </>
  );
};

export default memo(EditTest);
