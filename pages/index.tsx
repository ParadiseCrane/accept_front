import { DefaultLayout } from '@layouts/DefaultLayout';
import { ReactElement } from 'react';
import Title from '@ui/Title/Title';
import TopContent from '@components/MainPage/TopContent/TopContent';
import { useLocale } from '@hooks/useLocale';
import { ProjectCard } from '@components/MainPage/ProjectCard/ProjectCard';
import { cardList } from '@constants/CardList';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';

function IndexPage() {
  const { locale } = useLocale();

  return (
    <>
      <Title title={locale.titles.main} />
      <TopContent />
      <TipTapEditor />
      <TipTapEditor />
      <TipTapEditor />
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
