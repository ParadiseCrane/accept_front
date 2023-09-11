import { DefaultLayout } from '@layouts/DefaultLayout';
import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Title from '@ui/Title/Title';
import CustomTransferList from '@ui/CustomTransferList/New/CustomTransferList';
import {
  ICustomTransferListData,
  ICustomTransferListItemComponentProps,
} from '@custom-types/ui/basics/customTransferList';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getData = async (): Promise<ICustomTransferListData> => {
  await sleep(1000);
  return [
    [
      { value: '1', label: 'test one', sortValue: '' },
      { value: '2', label: 'test two', sortValue: '' },
      { value: '3', label: 'test three', sortValue: '' },
      { value: '4', label: 'test four', sortValue: '' },
    ],
    [{ value: '5', label: 'test five', sortValue: '' }],
  ];
};

function IndexPage() {
  const [loading, setLoading] = useState(true);

  const [data, setData] =
    useState<ICustomTransferListData>(undefined);

  useEffect(() => {
    setLoading(true);
    getData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const itemComponent = useCallback(
    ({
      item,
      onClick,
      index,
    }: ICustomTransferListItemComponentProps): ReactNode => (
      <div key={index} onClick={onClick}>
        {item.label}
      </div>
    ),
    []
  );

  // const [counter, setCounter] = useState(0);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <>
      <Title title={'Тестовая страница'} />
      <CustomTransferList
        key={
          data
            ? data[0].map((item) => item.label).join() +
              data[1].map((item) => item.label).join()
            : ''
        }
        value={data}
        loading={loading}
        itemComponent={itemComponent}
        sortOrder={-1}
        onChange={setData}
        searchKeys={['label']}
      />
    </>
  );
}
IndexPage.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
export default IndexPage;
