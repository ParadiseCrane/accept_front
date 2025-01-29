import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Badge, Title } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import Image from 'next/legacy/image';
import Link from 'next/link';
import logo from 'public/logo.svg';
import { FC, memo, useMemo, useState } from 'react';

import styles from './logo.module.css';

const imageSize = {
  md: 48,
  sm: 32,
};

const Logo: FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const { locale } = useLocale();
  const { user } = useUser();
  const [jumpItem, setJumpItem] = useState('');
  let letters = useMemo(() => locale.accept.split(''), [locale.accept]);

  useHotkeys(
    letters.map((item) => [
      item,
      () => {
        setJumpItem(item);
        setTimeout(
          () => setJumpItem((old_item) => (old_item == item ? '' : old_item)),
          300
        );
      },
    ])
  );

  return (
    <Link href="/" className={styles.logoWrapper}>
      <Image
        src={logo}
        width={imageSize[size]}
        height={imageSize[size]}
        alt="Accept"
      />
      {/* <div className={styles.name}> */}
      <Title order={1} size="1.4em">
        {letters.map((item, index) => (
          <span key={index} className={item == jumpItem ? styles.jump : ''}>
            {item}
          </span>
        ))}
      </Title>
      {/* </div> */}
      {user?.organization && (
        <Badge
          style={{
            alignSelf: 'start',
          }}
          size="md"
        >
          {user?.organization}
        </Badge>
      )}
    </Link>
  );
};

export default memo(Logo);
