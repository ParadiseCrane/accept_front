import { DefaultLayout } from '@layouts/DefaultLayout';
import { ReactElement } from 'react';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';

function TestPage() {
  return (
    <div
      style={{
        padding: '20px 100px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <TipTapEditor editorMode={true} />
    </div>
  );
}
TestPage.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
export default TestPage;
