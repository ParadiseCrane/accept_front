import Title from '@ui/Title/Title';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { ReactElement, useState } from 'react';

import { IDraggableBoardColumn } from '@custom-types/ui/IDraggableBoard';
import CustomDraggableBoard from '@ui/CustomDraggableBoard/CustomDraggableBoard';

// const getId = () => {
//   return randomUUID();
// };

function TestPage() {
  const [columns, setColumns] = useState<IDraggableBoardColumn[]>(
    new Array(5).fill(undefined).map((_, index) => ({
      columnLabel: `Группа #${index + 1}`,
      id: ((index + 1) * 10000).toString() + '_asd',
      values: new Array(10).fill(undefined).map((_, idx) => ({
        id: ((index + 1) * 10000 + idx).toString(),
        label: `Тест #${index * 10 + idx + 1}`,
      })),
    }))
  );

  return (
    <>
      <Title title={'Test'} />
      {/* <Board initial={generateQuoteMap(5)} withScrollableColumns /> */}
      <CustomDraggableBoard
        horizontal
        columns={columns}
        setColumns={setColumns}
      />
    </>
  );
}

TestPage.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default TestPage;
