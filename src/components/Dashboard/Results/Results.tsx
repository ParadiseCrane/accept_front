import {
  IActivityResults,
  IResult,
  IResultPayload,
} from '@custom-types/data/IResults';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { sendRequest } from '@requests/request';
import { LoadingOverlay, SegmentedControl, Tip } from '@ui/basics';
import ResultsTable, { IData, ILabel } from '@ui/ResultsTable/ResultsTable';
import { letterFromIndex } from '@utils/letterFromIndex';
import Link from 'next/link';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import styles from './results.module.css';

const getScoreColor = (score: number | undefined) => {
  return score === undefined
    ? '#000'
    : score === 100
      ? 'var(--positive)'
      : 'var(--negative)';
};

const getTotalScoreColor = (score: number | undefined) => {
  return !score || score === 0 ? 'var(--negative)' : 'var(--positive)';
};

const Results: FC<{
  spec: string;
  isFinished: boolean;
  endDate: Date;
  full?: boolean;
  is_team?: boolean;
  type: 'assignment' | 'tournament';
}> = ({ spec, isFinished, endDate, type, full, is_team }) => {
  const { locale } = useLocale();

  const [fetchDate, setFetchDate] = useState<'actual' | 'end'>(
    isFinished ? 'end' : 'actual'
  );

  const [displayMode, setDisplayMode] = useState<'verdict' | 'score'>('score');

  const url = useMemo(() => `${type}/results/${spec}`, [spec, type]);
  const innerToDate = useMemo(
    () => (fetchDate == 'end' ? endDate : undefined),
    [fetchDate, endDate]
  );

  const { data, loading, refetch } = useRequest<
    { toDate?: Date },
    IActivityResults
  >(url, 'POST', {
    toDate: innerToDate,
  });

  useEffect(() => {
    if (!loading) refetch(true);
  }, [fetchDate]); // eslint-disable-line

  const resultComponent = useCallback(
    (item: IResult, index: number) => (
      <Link
        key={index}
        href={`/attempt/${item.attempt}`}
        style={{
          textDecoration: 'none',
          color: getScoreColor(item.score),
        }}
      >
        {item.verdict
          ? displayMode == 'score'
            ? item.score.toString()
            : `${item.verdict.shortText} #${item.verdictTest}`
          : '?'}
      </Link>
    ),
    [displayMode]
  );

  const fetchRestResults = useCallback(
    (target: string, task_index: number) => {
      if (!data || !full) return async () => [] as ILabel[];
      const task = data?.tasks[task_index];
      return async () =>
        await sendRequest<IResultPayload, IResult[]>(
          `results/${type}`,
          'POST',
          {
            spec,
            target,
            task: task.spec,
            toDate: innerToDate,
          },
          60 * 1000
        ).then((res) => {
          const result = res.error
            ? ([] as ILabel[])
            : res.response.map(resultComponent);
          return result;
        });
    },
    [data, full, type, spec, innerToDate, resultComponent]
  );

  const table_data: IData[][] = useMemo(() => {
    if (!data || data.results.length == 0) return [];
    return data.results.map((participant_result) =>
      participant_result.best
        .map((task_result, index) => ({
          best: (
            <div style={{ color: getScoreColor(task_result?.score) }}>
              {task_result
                ? displayMode == 'score'
                  ? task_result.score.toString()
                  : `${task_result.verdict.shortText} #${task_result.verdictTest}`
                : '-'}
            </div>
          ),
          rest: full
            ? fetchRestResults(participant_result.participant.identifier, index)
            : undefined,
        }))
        .concat([
          {
            best: (
              <div
                style={{
                  color: getTotalScoreColor(participant_result.score),
                }}
              >
                {participant_result.score.toString()}
              </div>
            ),
            rest: undefined,
          },
          {
            best: <>{participant_result.totalTime.toString()}</>,
            rest: undefined,
          },
          {
            best: <>{participant_result.place.toString()}</>,
            rest: undefined,
          },
        ])
    );
  }, [data, fetchRestResults, displayMode, full]);

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
            onChange={(value) => setFetchDate(value as 'actual' | 'end')}
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
          onChange={(value) => setDisplayMode(value as 'verdict' | 'score')}
        />
      </div>

      <LoadingOverlay visible={loading} />
      {data && data.results.length > 0 && data.tasks.length > 0 ? (
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
            <>{locale.assignment.totalTime}</>,
            <>{locale.assignment.place}</>,
          ]}
          rows={data.results.map((result, index) =>
            is_team ? (
              <Link
                key={index}
                href={`/team/${result.participant.identifier}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {result.participant.label}
              </Link>
            ) : (
              <Tip label={result.participant.identifier} key={index}>
                <Link
                  href={`/profile/${result.participant.identifier}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  {result.participant.label}
                </Link>
              </Tip>
            )
          )}
          data={table_data}
        />
      ) : (
        <div className={styles.empty}>{locale.ui.table.emptyMessage}</div>
      )}
    </div>
  );
};

export default memo(Results);
