import { IAttempt } from '@custom-types/data/IAttempt';
import { getLocalDate } from '@utils/datetime';
import Link from 'next/link';
import { FC, memo, useEffect, useMemo, useState } from 'react';
import { useLocale } from '@hooks/useLocale';
import tableStyles from '@styles/ui/customTable.module.css';

import styles from './info.module.css';
import VerdictWrapper from '@ui/VerdictWrapper/VerdictWrapper';

const Info: FC<{ attempt: IAttempt }> = ({ attempt }) => {
  const { locale } = useLocale();
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const rows = useMemo(
    () =>
      attempt.results.map((row) => ({
        ...row,
        index: row.test + 1,
      })),
    [attempt.results]
  );

  const columnSizes = useMemo(() => [1, 2], []);
  const columns = useMemo(
    () => [locale.attempt.test, locale.attempt.result],
    [locale.attempt.result, locale.attempt.test]
  );
  const gridTemplate = useMemo(() => {
    let total = 0;
    if (!columnSizes || columnSizes.length < columns.length) {
      total = columns.length;
      return {
        gridTemplateColumns:
          columns.map((_) => 100 / total).join('% ') + '%',
      };
    }
    for (let i = 0; i < columns.length; i++) {
      total += columnSizes[i];
    }
    return {
      gridTemplateColumns:
        columns
          .map((_, idx) => (columnSizes[idx] / total) * 100)
          .join('% ') + '%',
    };
  }, [columnSizes, columns]);

  return (
    <div className={styles.infoWrapper}>
      <div className={styles.left}>
        <div>{isBrowser && getLocalDate(attempt.date)}</div>
        <div>
          {locale.attempt.task}{' '}
          <Link
            href={`/task/${attempt.task.spec}`}
            className={styles.link}
          >
            {attempt.task.title}
          </Link>
        </div>
        <div>
          {locale.attempt.author}{' '}
          <Link
            href={`/profile/${attempt.author.login}`}
            className={styles.link}
          >
            {attempt.author.shortName}
          </Link>
        </div>
        <div>
          {locale.attempt.language}
          {': '}
          <span>{attempt.language.name}</span>
        </div>
        <div>
          {locale.attempt.status}
          {': '}
          <span>{locale.attempt.statuses[attempt.status.spec]}</span>
        </div>
        {attempt.status.spec == 3 && attempt.banInfo && (
          <div>
            {locale.attempt.banReason}
            {': '}
            <span>{attempt.banInfo.reason}</span>
          </div>
        )}
        <div>
          {locale.attempt.constraints.time}
          {': '}
          <span
            style={{
              fontSize: 'var(--font-size-m)',
            }}
          >
            {attempt.constraints?.time || 0}
            {'s'}
          </span>
        </div>
        <div>
          {locale.attempt.constraints.memory}
          {': '}
          <span>
            {attempt.constraints?.memory || 0}
            {'MB'}
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.tableWrapper}>
          {rows.length > 0 && (
            <table className={tableStyles.table}>
              <thead>
                <tr className={tableStyles.row} style={gridTemplate}>
                  {columns.map((column, index) => (
                    <th key={index} className={styles.column}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={
                      tableStyles.row +
                      ' ' +
                      (index % 2 === 0 ? tableStyles.even : '')
                    }
                    style={gridTemplate}
                  >
                    <td
                      className={`${tableStyles.cell} ${styles.cell}`}
                    >
                      {row.index}
                    </td>
                    <td
                      className={`${tableStyles.cell} ${styles.cell}`}
                    >
                      <VerdictWrapper verdict={row.verdict} full />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Info);
