import Image from 'next/legacy/image';
import logo from 'public/logo.svg';
import { FC, memo, useMemo, useState } from 'react';
import { useLocale } from '@hooks/useLocale';
import Link from 'next/link';
import styles from './logo.module.css';
import { useHotkeys } from '@mantine/hooks';
import { useUser } from '@hooks/useUser';

const Logo: FC = () => {
  const { locale } = useLocale();
  const { user } = useUser();
  const [jumpItem, setJumpItem] = useState('');
  let letters = useMemo(
    () => locale.accept.split(''),
    [locale.accept]
  );

  useHotkeys(
    letters.map((item) => [
      item,
      () => {
        setJumpItem(item);
        setTimeout(
          () =>
            setJumpItem((old_item) =>
              old_item == item ? '' : old_item
            ),
          300
        );
      },
    ])
  );

  return (
    <Link href="/" className={styles.logoWrapper}>
      <Image src={logo} width={48} height={48} alt="Accept" />
      <div className={styles.name}>
        {letters.map((item, index) => (
          <span
            key={index}
            className={item == jumpItem ? styles.jump : ''}
          >
            {item}
          </span>
        ))}
      </div>
      <span
        style={{
          fontSize: 'var(--font-size-s)',
          alignSelf: 'start',
          color: 'var(--secondary)',
        }}
      >
        {user?.organization}
      </span>
    </Link>
  );
};

export default memo(Logo);
