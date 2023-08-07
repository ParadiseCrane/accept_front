import { BaseSearch } from '@custom-types/data/request';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import Table from '@ui/Table/Table';
import { FC, memo, useEffect, useMemo, useState } from 'react';
import { sendRequest } from '@requests/request';
import { IAnalyticsData } from '@custom-types/data/atomic';
import tableStyles from '@styles/ui/customTable.module.css';
import styles from './analytics.module.css';

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.dashboard.developer.analytics.table.path,
    key: 'path',
    sortable: false,
    sortFunction: (a: any, b: any) => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 6,
  },
  {
    label: locale.dashboard.developer.analytics.table.average,
    key: 'average_time',
    sortable: true,
    sortFunction: (a: any, b: any) => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 3,
  },
  {
    label: locale.dashboard.developer.analytics.table.count,
    key: 'count',
    sortable: true,
    sortFunction: (a: any, b: any) => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 2,
  },
];

const Analytics: FC<{}> = ({}) => {
  const { locale } = useLocale();
  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale),
    [initialColumns, locale]
  );

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: 20,
    },
    sort_by: [],
    search_params: {
      search: '',
      keys: [],
    },
  });

  const [data, setData] = useState<IAnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    sendRequest<BaseSearch, IAnalyticsData[]>(
      'analytics/search',
      'POST',
      searchParams
    ).then((res) => {
      if (!res.error) {
        setData(res.response);
      }
      setLoading(false);
    });
  }, [searchParams]);

  return (
    <Table
      columns={columns}
      rows={data}
      loading={loading}
      defaultOnPage={20}
      onPage={[10, 20, 40]}
      total={data.length}
      searchParams={searchParams}
      setSearchParams={setSearchParams}
      noDefault
      classNames={{
        wrapper: styles.wrapper,
        table: tableStyles.table,
        headerCell: tableStyles.headerCell,
        cell: tableStyles.cell,
        even: tableStyles.even,
        odd: tableStyles.odd,
      }}
    />
  );
};

export default memo(Analytics);
