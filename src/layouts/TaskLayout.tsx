import { callback, setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Tabs } from '@ui/basics';
import Title from '@ui/Title/Title';
import { FC, ReactNode, memo, useMemo } from 'react';

const TaskLayout: FC<{
  description: ReactNode;
  send?: callback<any, ReactNode>;
  results?: callback<any, ReactNode>;
  title?: string;
}> = ({ description, send, results, title }) => {
  const { locale } = useLocale();

  const { isUser } = useUser();

  const pages = useMemo(
    () => [
      {
        value: 'description',
        title: locale.task.description.self,
        page: (_: string | null, __: setter<string | null>) => (
          <>{description}</>
        ),
      },
      {
        value: 'send',
        title: locale.task.send,
        page: (
          activeTab: string | null,
          setActiveTab: setter<string | null>
        ) => <>{send && send(setActiveTab)}</>,
      },
      {
        value: 'results',
        title: locale.task.results,
        page: (activeTab: string | null, _: setter<string | null>) => (
          <>{results && results(activeTab)}</>
        ),
      },
    ],
    [description, locale, results, send]
  );

  return (
    <>
      {title && <Title title={title} />}
      {isUser && (results || send) ? (
        <Tabs pages={pages} defaultPage={'description'} />
      ) : (
        <>{description}</>
      )}
    </>
  );
};

export default memo(TaskLayout);
