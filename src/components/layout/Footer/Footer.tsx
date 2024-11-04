import { FC, memo } from 'react';
import styles from './footer.module.css';
import { useLocale } from '@hooks/useLocale';
import LocaleSelector from '@ui/LocaleSelector/LocaleSelector';
import { BrandGithub } from 'tabler-icons-react';
import { ActionIcon } from '@mantine/core';
import Link from 'next/link';

const Footer: FC = () => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <div>
        <LocaleSelector />
      </div>
      <div className={styles.githubs}>
        <div className={styles.github}>
          <ActionIcon component={Link} href={'https://github.com/dsomni'}>
            <BrandGithub size={24} color={'white'} />
          </ActionIcon>
        </div>
        <div className={styles.github}>
          <ActionIcon component={Link} href={'https://github.com/RetroMeras'}>
            <BrandGithub size={24} color={'white'} />
          </ActionIcon>
        </div>
      </div>
      <div className={styles.copyright}>
        © {locale.credentials.startYear} - {new Date().getFullYear()}{' '}
        {locale.credentials.company}
      </div>
    </div>
  );
};

export default memo(Footer);
