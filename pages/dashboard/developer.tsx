import DeveloperDashboard from '@components/DeveloperDashboard/DeveloperDashboard';
import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { ReactNode } from 'react';

function DeveloperDashboardPage() {
  const { locale } = useLocale();

  return (
    <>
      <Title title={locale.titles.dashboard.developer} />
      <DeveloperDashboard />
    </>
  );
}

DeveloperDashboardPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default DeveloperDashboardPage;
