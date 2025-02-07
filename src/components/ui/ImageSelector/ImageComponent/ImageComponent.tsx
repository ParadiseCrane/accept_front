import { FC, useEffect, useState } from 'react';
import { Image, Skeleton } from '@mantine/core';
import styles from './styles.module.css';
import { useRequest } from '@hooks/useRequest';
import { sendRequest } from '@requests/request';

interface ImageComponentProps {
  index: number;
  item: string;
  onClick: () => void;
  active: boolean;
}

export const ImageComponent: FC<ImageComponentProps> = ({
  index,
  item,
  onClick,
  active,
}) => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    if (item !== '') {
      fetch(`/api/image/${item}`)
        .then((res) => res.blob())
        .then((blob) => {
          setData(URL.createObjectURL(blob));
        });
    }
  }, [item]);

  if (!data || item === '') {
    return <Skeleton animate={false} height={100} radius="md" />;
  }

  return (
    <Image
      alt={`Image ${index + 1}`}
      src={data}
      radius={'md'}
      h={100}
      fit="cover"
      onClick={onClick}
      className={active ? styles.image_component : ''}
    />
  );
};
