import { DefaultLayout } from '@layouts/DefaultLayout';
import { Button } from '@ui/basics';
import { getCookieValue } from '@utils/cookies';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { getApiUrl } from '@utils/getServerUrl';
import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';

interface InvitePageProps {
  success: boolean;
  entity_type: string;
  entity_spec: string;
}

function InvitePage(props: InvitePageProps) {
  if (!props.success)
    return (
      <div>
        <h1>Вы уже добавлены в эту группу.</h1>
        <Button href="/">На главную</Button>
      </div>
    );
  return (
    <div>
      <h1>Вы успешно добавлены в эту группу.</h1>
      <Button href={`/course/${props.entity_spec}`}>Перейти к курсу</Button>
    </div>
  );
}

InvitePage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default InvitePage;

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
  const response = await fetchWrapperStatic({ url: `invite/${spec}`, req });
  switch (response.status) {
    case 200: {
      const response_json = await response.json();
      return {
        props: {
          success: true,
          entity_type: response_json['entity_type'],
          entity_spec: response_json['entity_spec'],
        } as InvitePageProps,
      };
    }
    case 304:
      return {
        props: {
          success: false,
        } as InvitePageProps,
      };
    default:
      return {
        redirect: {
          permanent: false,
          destination: '/404',
        },
      };
  }
};
