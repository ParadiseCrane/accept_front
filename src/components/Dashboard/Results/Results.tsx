import { FC, memo, useEffect, useMemo, useState } from 'react';
import ResultsTable from '@ui/ResultsTable/ResultsTable';
import styles from './results.module.css';
import { useRequest } from '@hooks/useRequest';
import { LoadingOverlay, SegmentedControl, Tip } from '@ui/basics';
import { useLocale } from '@hooks/useLocale';
import { IFullResults } from '@custom-types/data/IResults';
import { letterFromIndex } from '@utils/letterFromIndex';
import Link from 'next/link';

const getScoreColor = (score: number | undefined) => {
  return score === undefined
    ? '#000'
    : score === 100
    ? 'var(--positive)'
    : 'var(--negative)';
};

const getTotalScoreColor = (score: number | undefined) => {
  return !score || score === 0
    ? 'var(--negative)'
    : 'var(--positive)';
};

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

  const [displayMode, setDisplayMode] = useState<'verdict' | 'score'>(
    'score'
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
    if (!data || data.user_results.length == 0) return [];
    let rows = data.user_results.map((user_result) =>
      user_result.results
        .map((cell) => ({
          best: (
            <div style={{ color: getScoreColor(cell.best?.score) }}>
              {cell.best
                ? displayMode == 'score'
                  ? cell.best.score.toString()
                  : `${cell.best.verdict.shortText} #${cell.best.verdictTest}`
                : '-'}
            </div>
          ),
          rest: full
            ? cell.attempts.reverse().map((attempt, index) => (
                <Link
                  key={index}
                  href={`/attempt/${attempt.attempt}`}
                  style={{
                    textDecoration: 'none',
                    color: getScoreColor(attempt.score),
                  }}
                >
                  {attempt.verdict
                    ? displayMode == 'score'
                      ? attempt.score.toString()
                      : `${attempt.verdict.shortText} #${attempt.verdictTest}`
                    : '?'}
                </Link>
              ))
            : [],
        }))
        .concat({
          best: (
            <div
              style={{
                color: getTotalScoreColor(user_result.score),
              }}
            >
              {user_result.score.toString()}
            </div>
          ),
          rest: [],
        })
    );
    let current = 1;
    let streak = 1;
    let last_score = -1;
    rows[0] = rows[0].concat({
      best: <>{current.toString()}</>,
      rest: [],
    });
    last_score = data.user_results[0].score;
    for (let i = 1; i < rows.length; i++) {
      const current_score = data.user_results[i].score;
      if (current_score == last_score) {
        streak += 1;
        rows[i] = rows[i].concat({
          best: <>{current.toString()}</>,
          rest: [],
        });
        continue;
      }
      current += streak;
      streak = 1;
      last_score = current_score;
      rows[i] = rows[i].concat({
        best: <>{current.toString()}</>,
        rest: [],
      });
    }
    return rows;
  }, [data, displayMode, full]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
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
        <SegmentedControl
          data={[
            {
              label: locale.assignment.score,
              value: 'score',
            },
            {
              label: locale.assignment.verdicts,
              value: 'verdict',
            },
          ]}
          value={displayMode}
          onChange={(value) =>
            setDisplayMode(value as 'verdict' | 'score')
          }
        />
      </div>

      <LoadingOverlay visible={loading} />
      {data &&
      data.user_results.length > 0 &&
      data.tasks.length > 0 ? (
        <ResultsTable
          refetch={refetch}
          columns={[
            ...data.tasks.map((task, index) => (
              <Link
                key={index}
                href={`/task/${task.spec}?${type}=${spec}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {letterFromIndex(index)}
              </Link>
            )),
          ]}
          fixedRightColumns={[
            <>{locale.assignment.score}</>,
            <>{locale.assignment.place}</>,
          ]}
          rows={data.user_results.map((user_result, index) => (
            <Tip label={user_result.user.login} key={index}>
              <Link
                href={`/profile/${user_result.user.login}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {user_result.user.shortName}
              </Link>
            </Tip>
          ))}
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
