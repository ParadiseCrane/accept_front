import { FC, memo, useEffect, useMemo, useState } from 'react';
import ResultsTable from '@ui/ResultsTable/ResultsTable';
import styles from './results.module.css';
import { useRequest } from '@hooks/useRequest';
import { LoadingOverlay, SegmentedControl } from '@ui/basics';
import { useLocale } from '@hooks/useLocale';
import {
  IFullResults,
  IUserResult,
} from '@custom-types/data/IResults';
import { letterFromIndex } from '@utils/letterFromIndex';

const Results: FC<{
  spec: string;
  isFinished: boolean;
  endDate: Date;
  type: string;
  full: boolean;
}> = ({ spec, isFinished, endDate, type, full }) => {
  const { locale } = useLocale();

  const [fetchDate, setFetchDate] = useState<'actual' | 'end'>(
    isFinished ? 'end' : 'actual'
  );

  const { data, loading, refetch } = useRequest<
    {
      toDate: Date | undefined;
    },
    IFullResults
  >(`${type}/results/${spec}`, 'POST', {
    toDate: fetchDate == 'end' ? endDate : undefined,
  });

  useEffect(() => {
    if (!loading) refetch(true);
  }, [fetchDate]); // eslint-disable-line

  const table_data = useMemo(() => {
    if (!data) return [];
    let rows = data.user_results.map((user_result) =>
      user_result.results
        .map((cell) => ({
          best: cell.best?.verdict
            ? `${cell.best.verdict.shortText} #${cell.best.verdictTest}`
            : '-',
          rest: full
            ? cell.attempts.reverse().map((attempt) => ({
                text: attempt.verdict
                  ? `${attempt.verdict.shortText} #${attempt.verdictTest}`
                  : '?',
                href: `/attempt/${attempt.attempt}`,
              }))
            : [],
        }))
        .concat({
          best: user_result.score.toString(),
          rest: [],
        })
    );
    let current = 1;
    let streak = 1;
    let last_score = -1;
    rows[0] = rows[0].concat({
      best: current.toString(),
      rest: [],
    });
    last_score = data.user_results[0].score;
    for (let i = 1; i < rows.length; i++) {
      const current_score = data.user_results[i].score;
      if (current_score == last_score) {
        streak += 1;
        rows[i] = rows[i].concat({
          best: current.toString(),
          rest: [],
        });
        continue;
      }
      current += streak;
      streak = 1;
      last_score = current_score;
      rows[i] = rows[i].concat({
        best: current.toString(),
        rest: [],
      });
    }
    return rows;
  }, [data]);

  return (
    <div className={styles.wrapper}>
      {full && isFinished && (
        <SegmentedControl
          data={[
            {
              label: locale.dashboard.assignment.toDate.end,
              value: 'end',
            },
            {
              label: locale.dashboard.assignment.toDate.actual,
              value: 'actual',
            },
          ]}
          value={fetchDate}
          onChange={(value) =>
            setFetchDate(value as 'actual' | 'end')
          }
        />
      )}
      <LoadingOverlay visible={loading} />
      {data &&
      data.user_results.length > 0 &&
      data.tasks.length > 0 ? (
        <ResultsTable
          refetch={refetch}
          columns={[
            ...data.tasks.map((task, index) => ({
              text: letterFromIndex(index),
              href: `/task/${task.spec}?${type}=${spec}`,
            })),
            {
              text: locale.assignment.score,
              href: undefined,
            },
            {
              text: '#',
              href: undefined,
            },
          ]}
          rows={data.user_results.map((user_result) => ({
            text: user_result.user.shortName,
            href: `/profile/${user_result.user.login}`,
          }))}
          data={table_data}
        />
      ) : (
        <div className={styles.empty}>
          {locale.ui.table.emptyMessage}
        </div>
      )}
    </div>
  );
};

export default memo(Results);
