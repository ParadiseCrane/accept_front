import { useLocale } from '@hooks/useLocale';
import { Icon, Tip } from '@ui/basics';
import { openText } from '@utils/openText';
import { FC, ReactNode, memo, useCallback } from 'react';
import { Notes } from 'tabler-icons-react';

const OpenTextInNewTab: FC<{ text: string; icon?: ReactNode }> = ({
  text,
  icon,
}) => {
  const { locale } = useLocale();

  const onClick = useCallback(() => {
    openText(text);
  }, [text]);

  return (
    <Tip label={locale.newTab}>
      <Icon onClick={onClick} size="xs" color="var(--primary)">
        {icon ? icon : <Notes />}
      </Icon>
    </Tip>
  );
};

export default memo(OpenTextInNewTab);
