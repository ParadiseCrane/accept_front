import { DefaultLayout } from '@layouts/DefaultLayout';
import { ReactElement, useEffect, useState } from 'react';
import Title from '@ui/Title/Title';
import CustomTransferList from '@ui/CustomTransferList/New/CustomTransferList';
import { ICustomTransferListData } from '@custom-types/ui/basics/customTransferList';
import { TextInput } from '@ui/basics';

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

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <Title title={'Тестовая страница'} />
      <div
        style={{
          width: '60%',
          marginLeft: 'var(--spacer-l)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacer-m)',
        }}
      >
        <TextInput label={'Jopa'} />
        <CustomTransferList
          titles={['First', 'Second']}
          value={data}
          loading={loading}
          onChange={setData}
        />
      </div>
    </>
  );
}
IndexPage.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
export default IndexPage;
