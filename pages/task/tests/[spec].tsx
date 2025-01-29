import Tests from '@components/Task/Tests/Tests';
import { ITaskCheckType, ITaskType } from '@custom-types/data/atomic';
import { ITaskTestData } from '@custom-types/data/atomic';
import { IChecker } from '@custom-types/data/ITask';
import {
  ITaskTestsPayload,
  ITruncatedTaskTest,
} from '@custom-types/data/ITaskTest';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { Loader } from '@mantine/core';
import SingularSticky from '@ui/Sticky/SingularSticky';
import Title from '@ui/Title/Title';
import { getCookieValue } from '@utils/cookies';
import { getApiUrl } from '@utils/getServerUrl';
import { requestWithError } from '@utils/requestWithError';
import { GetServerSideProps } from 'next';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Download } from 'tabler-icons-react';
function TestsPage(props: { spec: string; has_write_rights: boolean }) {
  const task_spec = props.spec;
  const hasWriteRights = props.has_write_rights;

  const { locale, lang } = useLocale();
  const [loading, setLoading] = useState(false);

  const {
    data,
    loading: loadingTests,
    refetch,
  } = useRequest<
    undefined,
    {
      grouped_tests: ITruncatedTaskTest[][];
      truncate_limit: number;
      task_type: ITaskType;
      task_check_type: ITaskCheckType;
      checker?: IChecker;
    }
  >(`task/tests/${task_spec}`, 'GET');

  const downloadTests = useCallback(async () => {
    setLoading(true);
    let tests: ITaskTestData[] = [];
    await requestWithError<ITaskTestsPayload, { tests_data: ITaskTestData[] }>(
      `task_test/full/${task_spec}`,
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
        link.download = `${task_spec}_tests.zip`;
        link.click();
        link.remove();
        setLoading(false);
        URL.revokeObjectURL(href);
      }
    ).then(() => setLoading(false));
  }, [task_spec, locale, lang]);

  const testsKey = useMemo(
    () =>
      data?.grouped_tests
        .map((tests) => tests.map((item) => item.spec.slice(3)))
        .join() || '',
    [data?.grouped_tests]
  );

  return (
    <>
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
      {!loadingTests && data && (
        <Tests
          key={testsKey}
          task_spec={task_spec}
          refetch={refetch}
          grouped_tests={data.grouped_tests}
          truncate_limit={data.truncate_limit}
          checkType={data.task_check_type}
          taskType={data.task_type}
          checker={data.checker}
          hasWriteRights={hasWriteRights}
        />
      )}
    </>
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
  const access_token = getCookieValue(req.headers.cookie || '', 'access_token');

  const response = await fetch(
    `${API_URL}/api/task/write_tests_rights/${spec}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,

        cookie: req.headers.cookie,
      } as { [key: string]: string },
    }
  );
  if (response.status === 200) {
    const response_json = await response.json();

    return {
      props: {
        spec,
        has_write_rights: response_json,
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
