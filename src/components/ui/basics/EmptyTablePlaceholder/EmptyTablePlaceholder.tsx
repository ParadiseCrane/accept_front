import { DEFAULT_ON_PAGE } from '@constants/Defaults';
import { BaseSearch } from '@custom-types/data/request';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import tableStyles from '@styles/ui/customTable.module.css';
import Table from '@ui/Table/Table';
import { FC, ReactNode, memo, useMemo, useState } from 'react';
import styles from './style.module.css';

interface IEmptyItem {
  content: {
    value: string;
    display: ReactNode;
  };
}

const fillList = (numOfRows: number): IEmptyItem[] => {
  const list: IEmptyItem[] = [];
  for (let i = 0; i < numOfRows; i++) {
    list.push({
      content: {
        value: '',
        display: <div className={tableStyles.titleWrapper} />,
      },
    });
  }
  return list;
};

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.ui.table.emptyTableTitle,
    key: 'content',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.login.value > b.login.value
        ? 1
        : a.login.value == b.login.value
          ? 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 8,
  },
];

const EmptyTablePlaceholder: FC = () => {
  const { locale } = useLocale();
  const defaultOnPage = useMemo(() => DEFAULT_ON_PAGE, []);

  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale),
    [initialColumns, locale]
  );

  const numOfRows = 6;
  const content: IEmptyItem[] = fillList(numOfRows);

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    sort_by: [],
    search_params: {
      search: '',
      keys: ['content.value'],
    },
  });

  return (
    <div className={styles.parent}>
      <div className={styles.blurWrapper}>
        {locale.ui.table.emptyTableMessage}
      </div>
      <div className={styles.tablePadding}>
        <Table
          columns={columns}
          rows={content}
          classNames={{
            wrapper: tableStyles.wrapper,
            table: tableStyles.table,
            author: tableStyles.author,
            grade: tableStyles.grade,
            verdict: tableStyles.verdict,
            headerCell: tableStyles.headerCell,
            cell: tableStyles.cell,
            even: tableStyles.even,
            odd: tableStyles.odd,
          }}
          noDefault={true}
          defaultOnPage={defaultOnPage}
          onPage={[5, defaultOnPage]}
          total={numOfRows}
          empty={<>{locale.ui.table.emptyMessage}</>}
          isEmpty={false}
          nothingFound={<>{locale.ui.table.nothingFoundMessage}</>}
          loading={false}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
        />
      </div>
    </div>
  );
};

export default memo(EmptyTablePlaceholder);
