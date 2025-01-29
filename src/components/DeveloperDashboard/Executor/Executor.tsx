import { ExecutorBundle, IExecutor } from '@custom-types/data/IExecutor';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { useForm } from '@mantine/form';
import modalStyles from '@styles/ui/modal.module.css';
import {
  Button,
  LoadingOverlay,
  Select,
  TextArea,
  TextInput,
} from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { isJSON } from '@utils/isJSON';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithError } from '@utils/requestWithError';
import { FC, memo, useCallback, useState } from 'react';

import styles from './executor.module.css';

const Executor: FC<{}> = () => {
  const [response, setResponse] = useState('');
  const [openedConfirmModal, setOpenedConfirmModal] = useState(false);

  const { locale, lang } = useLocale();

  const { data, loading } = useRequest<{}, ExecutorBundle>(
    'bundle/executor',
    'GET'
  );

  const form = useForm({
    initialValues: {
      collection: '',
      action: '',
      query: '{\n\t\n}',
      body: '[\n\t{\n\t\n\t}\n]',
      params: '{\n\t\n}',
      spec_field: '',
    },
    validate: {
      collection: (value) =>
        value == undefined ? locale.executor.form.validation.collection : null,
      action: (value) =>
        value == undefined ? locale.executor.form.validation.action : null,
      query: (value) =>
        value.length < 2
          ? locale.executor.form.validation.query
          : !isJSON(value)
            ? locale.jsonValidationError
            : null,
      body: (value) =>
        value.length < 4
          ? locale.executor.form.validation.body.len
          : value[0] != '[' || value[value.length - 1] != ']'
            ? locale.executor.form.validation.body.array
            : !isJSON(value)
              ? locale.jsonValidationError
              : null,
      params: (value) =>
        value.length < 2
          ? locale.executor.form.validation.params
          : !isJSON(value)
            ? locale.jsonValidationError
            : null,
    },
    validateInputOnBlur: true,
  });

  const handleSend = useCallback(() => {
    let body: IExecutor;
    try {
      body = {
        collection: form.values.collection,
        action: form.values.action,
        query: JSON.parse(form.values.query),
        body: JSON.parse(form.values.body),
        params: JSON.parse(form.values.params),
      };
      if (form.values.spec_field.length != 0) {
        body['spec_field'] = form.values.spec_field;
      }
    } catch {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.executor.form.error.parse,
        autoClose: 5000,
      });
      return;
    }
    requestWithError<IExecutor, any>(
      'executor',
      'POST',
      locale.notify.executor.send,
      lang,
      body,
      (response) => {
        setResponse(JSON.stringify(response, null, 4));
      }
    );
    setOpenedConfirmModal(false);
  }, [form, locale, lang]);

  const handleSendClick = useCallback(() => {
    if (!form.isValid()) {
      return;
    }
    if (form.values.action == 'find') {
      handleSend();
    } else {
      setOpenedConfirmModal(true);
    }
  }, [form, handleSend]);

  return (
    <div className={styles.wrapper}>
      <SimpleModal
        opened={openedConfirmModal}
        close={() => setOpenedConfirmModal(false)}
        title={locale.executor.modals.execute.title}
      >
        <div className={modalStyles.verticalContent}>
          <div>{locale.executor.modals.execute.message}</div>
          <div className={styles.deleteWarning}>
            {locale.executor.modals.execute.warning}
          </div>

          <SimpleButtonGroup
            reversePositive
            actionButton={{
              label: locale.send,
              onClick: handleSend,
            }}
            cancelButton={{
              label: locale.cancel,
              onClick: () => setOpenedConfirmModal(false),
            }}
          />
        </div>
      </SimpleModal>
      <div className={styles.formWrapper}>
        <LoadingOverlay visible={loading} />
        <Select
          data={data?.collections.sort() || []}
          label={locale.executor.form.collection}
          searchable
          {...form.getInputProps('collection')}
        />
        <Select
          data={data?.actions || []}
          label={locale.executor.form.action}
          searchable
          {...form.getInputProps('action')}
        />
        <TextArea
          maxRows={15}
          minRows={5}
          label={locale.executor.form.query}
          {...form.getInputProps('query')}
        />
        <TextArea
          maxRows={15}
          minRows={5}
          label={locale.executor.form.body}
          {...form.getInputProps('body')}
        />
        <TextArea
          minRows={5}
          maxRows={15}
          label={locale.executor.form.params}
          {...form.getInputProps('params')}
        />
        <TextInput
          helperContent={locale.executor.form.helper.spec_field}
          label={locale.executor.form.spec_field}
          {...form.getInputProps('spec_field')}
        />
        <Button disabled={!form.isValid()} onClick={handleSendClick}>
          {locale.send}
        </Button>
      </div>
      {response.length > 0 && (
        <div className={styles.responseWrapper}>
          <TextArea
            label={locale.executor.response}
            minRows={15}
            maxRows={30}
            autosize
            value={response}
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default memo(Executor);
