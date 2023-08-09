import { GetServerSideProps } from 'next';
import Title from '@ui/Title/Title';
import { useLocale } from '@hooks/useLocale';
import { getApiUrl } from '@utils/getServerUrl';
import { REVALIDATION_TIME } from '@constants/PageRevalidation';
import { IRatingInfo } from '@custom-types/data/IRatingInfo';
import { ReactElement, useCallback } from 'react';
import { DefaultLayout } from '@layouts/DefaultLayout';
import PrimitiveTable from '@ui/PrimitiveTable/PrimitiveTable';
import tableStyles from '@styles/ui/primitiveTable.module.css';
import styles from '@styles/rating.module.css';
import Link from 'next/link';
import { Crown, Trophy } from 'tabler-icons-react';

const LIMIT = 50;
interface IndexedRatingInfo extends IRatingInfo {
  index: number;
}

function Rating(props: { users: IRatingInfo[] }) {
  const { locale } = useLocale();
  const users = props.users.map(
    (item, index) => ({ ...item, index } as IndexedRatingInfo)
  );
  const best_score = users[0].score;

  const rowComponent = useCallback(
    (user: IndexedRatingInfo) => (
      <>
        <td>
          {user.score == best_score ? (
            <Crown
              strokeWidth={1.3}
              fill={'#FFD700'}
              className={styles.crown}
              style={{ marginLeft: '-5px' }}
            />
          ) : (
            user.index + 1
          )}
        </td>
        <td>
          <Link
            href={`/profile/${user.user.login}`}
            legacyBehavior
            passHref
          >
            <a className={styles.link}>{user.user.login}</a>
          </Link>
        </td>
        <td>{user.user.shortName}</td>
        <td>{user.score}</td>
      </>
    ),
    [best_score]
  );

  return (
    <>
      <Title title={locale.titles.rating} />
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <Trophy size={40} strokeWidth={1} fill={'#FFD700'} />
          {locale.rating.info(LIMIT)}
        </div>
        <PrimitiveTable
          rows={users}
          rowComponent={rowComponent}
          columns={[
            locale.rating.place,
            locale.rating.login,
            locale.rating.shortName,
            locale.rating.score,
          ]}
          columnSizes={[1, 5, 10, 2]}
          classNames={{
            column: tableStyles.column,
            row: tableStyles.row,
            table: tableStyles.table,
            even: tableStyles.even,
          }}
        />
      </div>
    </>
  );
}

Rating.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
export default Rating;

const API_URL = getApiUrl();

export const getServerSideProps: GetServerSideProps = async ({
  res,
  ..._
}) => {
  const response = await fetch(`${API_URL}/api/rating/${LIMIT}`);
  if (response.status === 200) {
    res.setHeader(
      'Cache-Control',
      `public, s-maxage=10, stale-while-revalidate=${REVALIDATION_TIME.rating}`
    );
    const response_json = await response.json();
    return {
      props: {
        users: response_json,
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
