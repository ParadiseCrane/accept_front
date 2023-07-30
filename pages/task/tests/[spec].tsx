import { ReactNode, useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { ITaskCheckType, ITaskType } from '@custom-types/data/atomic';
import { IChecker } from '@custom-types/data/ITask';
import { sendRequest } from '@requests/request';
import stepperStyles from '@styles/ui/stepper.module.css';
import { useLocale } from '@hooks/useLocale';
import Title from '@ui/Title/Title';
import SingularSticky from '@ui/Sticky/SingularSticky';
import Tests from '@components/Task/Tests/Tests';
import {
  ITaskTestsPayload,
  ITruncatedTaskTest,
} from '@custom-types/data/ITaskTest';
import { ITaskTestData } from '@custom-types/data/atomic';
import { requestWithError } from '@utils/requestWithError';
import { Loader } from '@mantine/core';
import { Download } from 'tabler-icons-react';
import { getApiUrl } from '@utils/getServerUrl';
function TestsPage(props: { spec: string }) {
  const spec = props.spec;

  const { locale, lang } = useLocale();
  const [tests, setTests] = useState<ITruncatedTaskTest[]>([]);
  const [taskType, setTaskType] = useState<ITaskType>();
  const [taskCheckType, setTaskCheckType] =
    useState<ITaskCheckType>();
  const [checker, setChecker] = useState<IChecker>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendRequest<
      undefined,
      {
        tests: ITruncatedTaskTest[];
        task_type: ITaskType;
        task_check_type: ITaskCheckType;
        checker?: IChecker;
      }
    >(`task/tests/${spec}`, 'GET').then((res) => {
      if (!res.error) {
        setTests(res.response.tests);
        setTaskType(res.response.task_type);
        setTaskCheckType(res.response.task_check_type);
        setChecker(res.response.checker);
      }
    });
  }, [spec]);

  const downloadTests = useCallback(async () => {
    setLoading(true);
    let tests: ITaskTestData[] = [];
    await requestWithError<
      ITaskTestsPayload,
      { tests_data: ITaskTestData[] }
    >(
      `task_test/full/${spec}`,
      'GET',
      locale.notify.task.tests,
      lang,
      undefined,
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
  }, [spec, locale, lang]);

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

  const response = await fetch(`${API_URL}/api/task/exists/${spec}`, {
    headers: {
      cookie: req.headers.cookie,
    } as { [key: string]: string },
  });
  if (response.status === 200) {
    return {
      props: {
        spec,
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
