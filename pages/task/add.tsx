import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { UseFormReturnType } from '@mantine/form';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useUser } from '@hooks/useUser';
import Form from '@components/Task/Form/Form';
import { requestWithNotify } from '@utils/requestWithNotify';
import { useRequest } from '@hooks/useRequest';
import { ITaskAddBundle } from '@custom-types/data/bundle';

import {
  IHintAlarmType,
  ITaskCheckType,
  ITaskType,
} from '@custom-types/data/atomic';
import { Item } from '@ui/CustomTransferList/CustomTransferList';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import Title from '@ui/Title/Title';
import { useRouter } from 'next/router';

const initialValues = {
  spec: '',
  title: '',
  tags: [],
  author: '',
  complexity: 15,
  description: '',
  constraintsTime: 1,
  constraintsMemory: 16,
  examples: [{ inputData: '', outputData: '' }],
  inputFormat: '',
  outputFormat: '',
  remark: '',

  hasHint: false,
  hintContent: '',
  hintAlarmType: '0',
  hintAlarm: 0,

  allowedLanguages: [],
  forbiddenLanguages: [],

  checkerLang: '0',
  checkerCode: '',

  checkType: '0', //"tests" or "checker"
  taskType: '0', //"code" or "text"
  shouldRestrictLanguages: false,
};

function AddTask() {
  const { locale, lang } = useLocale();
  const { user } = useUser();
  const [taskTypes, setTaskTypes] = useState<ITaskType[]>([]);
  const [taskCheckTypes, setTaskCheckTypes] = useState<
    ITaskCheckType[]
  >([]);

  const router = useRouter();

  const tournament = useMemo(
    () => router.query.tournament,
    [router.query.tournament]
  );

  const [hintAlarmTypes, setHintAlarmTypes] = useState<
    IHintAlarmType[]
  >([]);

  const { data, loading } = useRequest<{}, ITaskAddBundle>(
    'bundle/task_add'
  );

  useEffect(() => {
    if (data) {
      setTaskTypes(data.task_types);
      setTaskCheckTypes(data.task_check_types);
      setHintAlarmTypes(data.hint_alarm_types);
    }
  }, [data]);

  const handleSubmit = useCallback(
    (form: UseFormReturnType<any>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.validationError,
          autoClose: 5000,
        });
        return;
      }
      const {
        checkerCode,
        checkerLang,
        hintContent,
        hintAlarmType,
        hintAlarm,
        constraintsMemory,
        constraintsTime,
        allowedLanguages,
        forbiddenLanguages,
        tags,
        ...values
      } = form.values;
      let body: any = {
        ...values,
        author: user?.login || '',
        checkType: +form.values['checkType'],
        taskType: +form.values['taskType'],
        constraints: {
          time: constraintsTime,
          memory: constraintsMemory,
        },
        allowedLanguages: allowedLanguages.map(
          (lang: Item) => lang.value
        ),
        forbiddenLanguages: forbiddenLanguages.map(
          (lang: Item) => lang.value
        ),
        tags: tags.map((tag: Item) => tag.value),
        hidden: !!tournament,
      };
      if (!form.values.shouldRestrictLanguages) {
        body.allowedLanguages = [];
        body.forbiddenLanguages = [];
      }
      if (form.values['checkType'] === '1') {
        body.checker = {
          sourceCode: checkerCode,
          language: +checkerLang,
        };
      }
      if (form.values['remark'].trim() === '') {
        body.remark = undefined;
      }
      if (form.values['hasHint']) {
        body.hint = {
          content: hintContent,
          alarmType: +hintAlarmType,
          alarm: hintAlarm,
        };
      }
      requestWithNotify(
        !tournament ? 'task/add' : `tournament/task/${tournament}`,
        'POST',
        locale.notify.task.create,
        lang,
        (spec: string) => spec,
        body
      );
    },
    [locale, user, lang, tournament]
  );

  return (
    <>
      <Title title={locale.titles.task.add} />
      {!loading && (
        <Form
          initialValues={initialValues}
          taskTypes={taskTypes}
          taskCheckTypes={taskCheckTypes}
          hintAlarmTypes={hintAlarmTypes}
          handleSubmit={handleSubmit}
          buttonLabel={locale.form.create}
        />
      )}
    </>
  );
}

AddTask.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AddTask;
