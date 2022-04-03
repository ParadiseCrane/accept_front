import { ReactNode } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getServerUrl } from '@utils/getServerUrl';
import { IAssignmentSchema } from '@custom-types/IAssignmentSchema';
import Description from '@components/AssignmentSchema/Description/Description';
import { DefaultLayout } from '@layouts/DefaultLayout';

function Assignment(props: { assignment: IAssignmentSchema }) {
  const assignment = props.assignment;
  return <Description assignment={assignment} />;
}

Assignment.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Assignment;

const SERVER_URL = getServerUrl();

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || typeof params?.spec !== 'string') {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  const assignment = await fetch(
    `${SERVER_URL}/api/assignments/schema/${params.spec}`,
    {
      method: 'GET',
    }
  );
  if (assignment.status === 200) {
    return {
      props: {
        assignment: await assignment.json(),
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/Not-Found',
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
