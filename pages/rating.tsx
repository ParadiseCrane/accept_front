"use client";
import { REVALIDATION_TIME } from "@constants/PageRevalidation";
import { IRatingInfo } from "@custom-types/data/IRatingInfo";
import { useLocale } from "@hooks/useLocale";
import { DefaultLayout } from "@layouts/DefaultLayout";
import styles from "@styles/rating.module.css";
import tableStyles from "@styles/ui/primitiveTable.module.css";
import PrimitiveTable from "@ui/PrimitiveTable/PrimitiveTable";
import Title from "@ui/Title/Title";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { ReactElement, useCallback } from "react";
import { IconCrown, IconTrophy } from "@tabler/icons-react";
import clsx from "clsx";
import { fetchWrapperStatic } from "@utils/fetchWrapper";

const LIMIT = 50;
interface IndexedRatingInfo extends IRatingInfo {
  index: number;
}

interface Props {
  users: IRatingInfo[];
  notAllowed?: boolean;
}

function Rating(props: Props) {
  const { locale } = useLocale();
  const users = props.users.map(
    (item, index) => ({ ...item, index }) as IndexedRatingInfo,
  );
  const best_score = users.length > 0 ? users[0].score : 0;

  const rowComponent = useCallback(
    (item: IndexedRatingInfo) => (
      <>
        <td className={styles.icon}>
          {item.score == best_score ? (
            <IconCrown
              strokeWidth={1.3}
              fill={"#FFD700"}
              className={styles.crown}
              style={{ marginLeft: "-5px" }}
            />
          ) : (
            item.index + 1
          )}
        </td>
        <td className={styles.login}>
          <Link href={`/profile/${item.user.login}`} className={styles.link}>
            {item.user.login}
          </Link>
        </td>
        <td className={styles.shortname}>{item.user.shortName}</td>
        <td className={styles.score}>{item.score}</td>
      </>
    ),
    [best_score],
  );

  return (
    <>
      <Title title={locale.titles.rating} />
      <div className={styles.wrapper}>
        <div className={styles.info}>
          <IconTrophy size={40} strokeWidth={1} fill={"#FFD700"} />
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
          columnSizes={[1, 5, 7, 2]}
          classNames={{
            column: tableStyles.column,
            row: tableStyles.row,
            table: clsx(tableStyles.table, styles.table),
            even: tableStyles.even,
          }}
          empty={<>{locale.ui.table.emptyMessage}</>}
        />
      </div>
    </>
  );
}

Rating.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
export default Rating;

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  ..._
}) => {
  const response = await fetchWrapperStatic({
    url: `rating/${LIMIT}`,
    req,
  });

  if (response.status === 200) {
    res.setHeader(
      "Cache-Control",
      `public, s-maxage=10, stale-while-revalidate=${REVALIDATION_TIME.rating}`,
    );
    const response_json = await response.json();

    return {
      props: {
        users: response_json,
      },
    };
  }

  return {
    notFound: true,
  };
};
