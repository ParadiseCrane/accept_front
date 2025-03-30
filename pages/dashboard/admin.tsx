import AdminDashboard from '@components/AdminDashboard/AdminDashboard';
import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { ReactNode } from 'react';

function AdminDashboardPage() {
  const { locale } = useLocale();
  return (
    <>
      <Title title={locale.titles.dashboard.admin} />
      <AdminDashboard />;
    </>
  );
}

AdminDashboardPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AdminDashboardPage;
