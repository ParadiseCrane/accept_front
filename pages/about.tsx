import About from '@components/About/About';
import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { ReactElement } from 'react';

function AboutPage() {
  const { locale } = useLocale();
  return (
    <>
      <Title title={locale.titles.about} />
      <About />
    </>
  );
}

AboutPage.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AboutPage;
