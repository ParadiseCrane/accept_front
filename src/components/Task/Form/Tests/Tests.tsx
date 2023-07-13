import { useLocale } from '@hooks/useLocale';
import { FC, memo } from 'react';

const Tests: FC<{}> = () => {
  const { locale } = useLocale();

  return (
    <div style={{ margin: '0 auto 0 auto' }}>
      {locale.task.tests.separate_page.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
};

export default memo(Tests);
