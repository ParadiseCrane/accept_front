import { ReactNode, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { getApiUrl } from '@utils/getServerUrl';
import { Tabs } from '@ui/basics';
import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import Info from '@components/Attempt/Info/Info';
import Code from '@components/Attempt/Code/Code';
import Title from '@ui/Title/Title';
import { IAttempt } from '@custom-types/data/IAttempt';
import styles from '@styles/attempt.module.css';
import TextAnswer from '@components/Attempt/TextAnswer/TextAnswer';
import BanModal from '@components/Attempt/BanModals/BanModal';
import UnbanModal from '@components/Attempt/BanModals/UnbanModal';
import { useRequest } from '@hooks/useRequest';
import { getCookieValue } from '@utils/cookies';

function Attempt(props: { attempt: IAttempt }) {
  const attempt = props.attempt;

  const { locale } = useLocale();

  const { data, loading, error } = useRequest<{}, boolean>(
    `attempt/can_ban/${attempt.spec}`,
    'GET'
  );

  const pages = useMemo(
    () => [
      {
        value: 'info',
        title: locale.attempt.pages.info,
        page: (_: string | null, __: setter<string | null>) => (
          <Info attempt={attempt} />
        ),
      },
      {
        value: 'code',
        title: locale.attempt.pages.code,
        page: (_: string | null, __: setter<string | null>) => (
          <>
            {attempt.textAnswers.length == 0 ? (
              <Code attempt={attempt} />
            ) : (
              <TextAnswer attempt={attempt} />
            )}
          </>
        ),
      },
    ],
    [attempt, locale]
  );

  return (
    <div className={styles.wrapper}>
      <Title title={`${locale.titles.attempt} ${attempt.author.login}`} />

      {!loading && !error && data && (
        <>
          {attempt.status.spec != 3 ? (
            <BanModal attempt={attempt} />
          ) : (
            <UnbanModal attempt={attempt} />
          )}
        </>
      )}

      <Tabs pages={pages} defaultPage={'info'} />
    </div>
  );
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
  const access_token = getCookieValue(req.headers.cookie || '', 'access_token');

  const response = await fetch(`${API_URL}/api/bundle/attempt/${spec}`, {
    method: 'GET',
    headers: {
      cookie: req.headers.cookie,
      Authorization: `Bearer ${access_token}`,

      'content-type': 'application/json',
    } as { [key: string]: string },
  });

  if (response.status === 200) {
    const res = await response.json();
    return {
      props: {
        attempt: res,
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
