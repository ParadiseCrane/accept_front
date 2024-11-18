import { DefaultLayout } from '@layouts/DefaultLayout';
import { ReactElement } from 'react';
import { useLocale } from '@hooks/useLocale';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';

function TestPage() {
  return (
    <>
      <TipTapEditor />
      <TipTapEditor />
      <TipTapEditor />
    </>
  );
}
TestPage.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
export default TestPage;
