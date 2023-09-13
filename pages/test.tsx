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
  let data: ICustomTransferListData = [[], []];
  const MAX = 1000;
  for (let index = 0; index < MAX; index++) {
    data[0].push({
      value: (2 * index).toString(),
      label: `test ${2 * index}`,
      sortValue: 2 * index,
    });
    data[1].push({
      value: (2 * index + 1).toString(),
      label: `test ${2 * index + 1}`,
      sortValue: 2 * index + 1,
    });
  }
  return data;
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
