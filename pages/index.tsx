'use client';

import { ProjectCard } from '@components/MainPage/ProjectCard/ProjectCard';
import TopContent from '@components/MainPage/TopContent/TopContent';
import { cardList } from '@constants/CardList';
import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { ReactElement } from 'react';

function IndexPage() {
  const { locale } = useLocale();

  return (
    <>
      <Title title={locale.titles.main} />
      <TopContent />
      <div style={{ marginBottom: 'var(--spacer-huge)' }}>
        {cardList.map((card, index) => {
          return <ProjectCard key={index} left={index % 2 == 0} card={card} />;
        })}
      </div>
    </>
  );
}
IndexPage.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
export default IndexPage;
