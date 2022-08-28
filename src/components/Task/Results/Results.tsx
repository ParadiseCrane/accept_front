import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Table from '@ui/Table/Table';
import { ITableColumn } from '@custom-types/ui/ITable';
import tableStyles from '@styles/ui/customTable.module.css';
import { useLocale } from '@hooks/useLocale';

import { IAttemptDisplay } from '@custom-types/data/IAttempt';
import { ILocale } from '@custom-types/ui/ILocale';
import { getLocalDate } from '@utils/datetime';
import { useUser } from '@hooks/useUser';
import { useRequest } from '@hooks/useRequest';
import { BaseSearch } from '@custom-types/data/request';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import AttemptList from '@ui/AttemptList/AttemptList';

const refactorAttempt = (
  attempt: IAttemptDisplay,
  locale: ILocale
): any => ({
  ...attempt,
  result: {
    display: (
      <div
        style={{
          color:
            attempt.status.spec == 2
              ? attempt.verdict.verdict.spec == 0
                ? 'var(--positive)'
                : 'var(--negative)'
              : 'black',
        }}
      >
        {attempt.status.spec == 2
          ? attempt.verdict.verdict.shortText +
            ' #' +
            (attempt.verdict.test + 1).toString()
          : locale.attempt.statuses[attempt.status.spec]}
      </div>
    ),
    value:
      attempt.status.spec == 2
        ? attempt.verdict.verdict.spec
        : attempt.status.spec - 10,
  },
  date: {
    display: <>{getLocalDate(attempt.date)}</>,
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
    sortFunction: (a: any, b: any) => 0,
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
    sortFunction: (a: any, b: any) => 0,
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
  return (
    <AttemptList
      url={`task/attempts/${spec}`}
      initialColumns={initialColumns}
      refactorAttempt={refactorAttempt}
      activeTab={activeTab === 'results'}
    />
  );
};

export default memo(Results);
