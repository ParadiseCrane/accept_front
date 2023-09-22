import { FC, memo, useMemo } from 'react';
import { ITableColumn } from '@custom-types/ui/ITable';

import { IAttemptDisplay } from '@custom-types/data/IAttempt';
import { ILocale } from '@custom-types/ui/ILocale';
import { getLocalDate } from '@utils/datetime';

import tableStyles from '@styles/ui/customTable.module.css';

import AttemptList from '@ui/AttemptList/AttemptList';
import VerdictWrapper from '@ui/VerdictWrapper/VerdictWrapper';
import Link from 'next/link';

const refactorAttempt = (attempt: IAttemptDisplay): any => ({
  ...attempt,
  result: {
    display: (
      <VerdictWrapper
        status={attempt.status}
        verdict={attempt.verdict?.verdict}
        test={attempt.verdict?.test}
        full
      />
    ),
    value:
      attempt.status.spec == 2
        ? attempt.verdict?.verdict.spec
        : attempt.status.spec == 3
        ? attempt.status.spec - 20
        : attempt.status.spec - 10,
  },
  date: {
    display: (
      <Link
        className={tableStyles.link}
        href={`/attempt/${attempt.spec}`}
      >
        {getLocalDate(attempt.date)}
      </Link>
    ),
    value: new Date(attempt.date).getTime(),
  },
  language: {
    display: <>{attempt.language.name}</>,
    value: attempt.language,
  },
});

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.attempt.date,
    key: 'date',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.date.value > b.date.value
        ? -1
        : a.date.value == b.date.value
        ? 0
        : 1,
    sorted: -1,
    allowMiddleState: false,
    hidable: false,
    hidden: false,
    size: 5,
  },
  {
    label: locale.attempt.language,
    key: 'language',
    sortable: false,
    sortFunction: (_: any, __: any) => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 5,
  },
  {
    label: locale.attempt.result,
    key: 'result',
    sortable: false,
    sortFunction: (_: any, __: any) => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 5,
  },
];

const Results: FC<{ spec: string; activeTab: string }> = ({
  spec,
  activeTab,
}) => {
  const url = useMemo(() => `task/attempts/${spec}`, [spec]);
  return (
    <AttemptList
      key={url}
      url={url}
      initialColumns={initialColumns}
      refactorAttempt={refactorAttempt}
      activeTab={activeTab === 'results'}
    />
  );
};

export default memo(Results);
