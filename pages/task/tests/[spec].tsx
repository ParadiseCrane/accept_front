import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { GetServerSideProps } from 'next';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { getApiUrl } from '@utils/getServerUrl';
import { ITaskCheckType, ITaskType } from '@custom-types/data/atomic';
import { IChecker } from '@custom-types/data/ITask';
import { sendRequest } from '@requests/request';
import stepperStyles from '@styles/ui/stepper.module.css';
import { useLocale } from '@hooks/useLocale';
import Title from '@ui/Title/Title';
import SingularSticky from '@ui/Sticky/SingularSticky';
import Tests from '@components/Task/Tests/Tests';
import {
  ITruncatedTaskTest,
  TaskTestsPayload,
} from '@custom-types/data/ITaskTest';
import { ITaskTestData } from '@custom-types/data/atomic';
import { requestWithError } from '@utils/requestWithError';
import { Loader } from '@mantine/core';
import { Download } from 'tabler-icons-react';
function TestsPage(props: {
  spec: string;
  tournament: string;
  assignment: string;
}) {
  const spec = props.spec;
  const body = useMemo(
    () =>
      props.tournament != ''
        ? {
            base_type: 'tournament',
            base_spec: props.tournament,
          }
        : props.assignment != ''
        ? {
            base_type: 'assignment',
            base_spec: props.assignment,
          }
        : { base_type: 'basic', base_spec: '' },
    [props.assignment, props.tournament]
  );

  const { locale, lang } = useLocale();
  const [tests, setTests] = useState<ITruncatedTaskTest[]>([]);
  const [taskType, setTaskType] = useState<ITaskType>();
  const [taskCheckType, setTaskCheckType] =
    useState<ITaskCheckType>();
  const [checker, setChecker] = useState<IChecker>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendRequest<
      {
        base_type: string;
        base_spec: string;
      },
      {
        tests: ITruncatedTaskTest[];
        task_type: ITaskType;
        task_check_type: ITaskCheckType;
        checker?: IChecker;
      }
    >(`task/tests/${spec}`, 'POST', body).then((res) => {
      if (!res.error) {
        setTests(res.response.tests);
        setTaskType(res.response.task_type);
        setTaskCheckType(res.response.task_check_type);
        setChecker(res.response.checker);
      }
    });
  }, [body, props.assignment, props.tournament, spec]);

  const downloadTests = useCallback(async () => {
    setLoading(true);
    let tests: ITaskTestData[] = [];
    await requestWithError<
      TaskTestsPayload,
      { tests_data: ITaskTestData[] }
    >(
      `task_test/full/${spec}`,
      'POST',
      locale.notify.task.tests,
      lang,
      {
        task_base_type: body.base_type,
        task_base_spec: body.base_spec,
      },
      async (response) => {
        tests = response.tests_data;
        if (tests.length == 0) {
          setLoading(false);
          return;
        }
        const { downloadZip } = await import('client-zip');
        const files: { name: string; input: string }[] = [];
        tests.forEach((test, index) => {
          files.push({
            name: `input${index}.txt`,
            input: test.inputData,
          });
          files.push({
            name: `output${index}.txt`,
            input: test.outputData,
          });
        });
        const blob = await downloadZip(files).blob();
        const link = document.createElement('a');
        const href = URL.createObjectURL(blob);
        link.href = href;
        link.download = `${spec}_tests.zip`;
        link.click();
        link.remove();
        setLoading(false);
        URL.revokeObjectURL(href);
      }
    );
  }, [spec, locale, lang, body]);

  return (
    <div className={stepperStyles.wrapper}>
      <Title title={locale.titles.task.tests} />
      <SingularSticky
        onClick={downloadTests}
        color="var(--primary)"
        icon={
          loading ? (
            <Loader color="white.0" variant="dots" size="md" />
          ) : (
            <Download />
          )
        }
        description={locale.tip.sticky.tests.download}
      />
      {taskCheckType && taskType && (
        <Tests
          tests={tests}
          checkType={taskCheckType}
          taskType={taskType}
          checker={checker}
        />
      )}
    </div>
  );
}

TestsPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default TestsPage;

const API_URL = getApiUrl();

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }
  const spec = query.spec;
  const tournament = query.tournament;
  const assignment = query.assignment;

  const response = await fetch(`${API_URL}/api/task/exists/${spec}`, {
    headers: {
      cookie: req.headers.cookie,
    } as { [key: string]: string },
  });
  if (response.status === 200) {
    return {
      props: {
        spec,
        tournament: tournament || '',
        assignment: assignment || '',
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  };
};
