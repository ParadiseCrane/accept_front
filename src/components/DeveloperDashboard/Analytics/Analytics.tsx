import { useRouter } from 'next/router';
import { BaseSearch } from '@custom-types/data/request';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import Table from '@ui/Table/Table';
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { sendRequest } from '@requests/request';
import {
  IAnalyticsData,
  IAnalyticsResponse,
} from '@custom-types/data/atomic';
import tableStyles from '@styles/ui/customTable.module.css';
import styles from './analytics.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { Button } from '@ui/basics';
import { requestWithError } from '@utils/requestWithError';

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.dashboard.developer.analytics.table.method,
    key: 'method',
    sortable: true,
    sortFunction: () => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 1,
  },
  {
    label: locale.dashboard.developer.analytics.table.path,
    key: 'path',
    sortable: false,
    sortFunction: () => 0,
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
    sortFunction: () => 0,
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
    sortFunction: () => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 2,
  },
];

const Analytics: FC<{}> = ({}) => {
  const { locale, lang } = useLocale();
  const router = useRouter();
  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale),
    [locale]
  );

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: 10,
    },
    sort_by: [],
    search_params: {
      search: '',
      keys: [],
    },
  });

  const [data, setData] = useState<IAnalyticsData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    sendRequest<BaseSearch, IAnalyticsResponse>(
      'analytics/search',
      'POST',
      searchParams
    ).then((res) => {
      if (!res.error) {
        setData(res.response.documents);
        setTotal(res.response.total);
      }
      setLoading(false);
    });
  }, [searchParams]);

  const [openedModal, setOpenedModal] = useState(false);

  const openModal = useCallback(() => setOpenedModal(true), []);
  const closeModal = useCallback(() => setOpenedModal(false), []);

  const clearAnalytics = useCallback(() => {
    requestWithError<undefined, boolean>(
      'analytics/delete',
      'GET',
      locale.notify.analytics.delete,
      lang
    ).then((res) => {
      closeModal();
      if (!res.error) {
        router.reload();
      }
    });
  }, [closeModal, lang, locale, router]);

  return (
    <div>
      {!loading && (
        <>
          <Button
            variant="outline"
            kind="negative"
            onClick={openModal}
          >
            {locale.delete}
          </Button>
          <SimpleModal
            title={locale.sure}
            opened={openedModal}
            close={closeModal}
          >
            <SimpleButtonGroup
              reversePositive
              actionButton={{ onClick: clearAnalytics }}
              cancelButton={{ onClick: closeModal }}
            />
          </SimpleModal>
        </>
      )}
      <Table
        columns={columns}
        rows={data}
        loading={loading}
        defaultOnPage={10}
        onPage={[10, 20, 40]}
        total={total}
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
    </div>
  );
};

export default memo(Analytics);
