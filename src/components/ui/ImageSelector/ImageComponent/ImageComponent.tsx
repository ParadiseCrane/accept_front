import { FC } from 'react';
import { Image } from '@mantine/core';
import styles from './styles.module.css';

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
  return (
    <Image
      alt={`Image ${index + 1}`}
      src={`/api/image/${item}`}
      radius={'md'}
      h={100}
      fit="cover"
      onClick={onClick}
      className={active ? styles.image_component : ''}
    />
  );
};
