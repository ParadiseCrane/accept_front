import { ReactNode, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { getApiUrl } from '@utils/getServerUrl';
import { openText } from '@utils/openText';

function Attempt(props: { data: string }) {
  const data = props.data;
  useEffect(() => openText(data), [data]);
  return <></>;
}

Attempt.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Attempt;

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
  const field = query.field;
  const tournament = query.tournament;
  const assignment = query.assignment;

  const body = tournament
    ? {
        test_spec: spec,
        task_base_type: 'tournament',
        task_base_spec: tournament,
      }
    : assignment
    ? {
        test_spec: spec,
        task_base_type: 'assignment',
        task_base_spec: assignment,
      }
    : {
        test_spec: spec,
        task_base_type: 'basic',
        task_base_spec: '',
      };

  const response = await fetch(
    `${API_URL}/api/task_test/field/${field}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        cookie: req.headers.cookie,
        'content-type': 'application/json',
      } as { [key: string]: string },
    }
  );

  if (response.status === 200) {
    const res = await response.json();
    console.log(res);

    return {
      props: {
        data: res,
      },
    };
  }
  if (response.status) {
    return {
      redirect: {
        permanent: false,
        destination: `/${response.status}`,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: `/404`,
    },
  };
};
