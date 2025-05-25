import { FC, useEffect, useState } from 'react';
import { Image, MantineStyleProp, Skeleton } from '@mantine/core';
import styles from './styles.module.css';

interface ImageComponentProps {
  index: number;
  item: string;
  onClick?: () => void;
  active: boolean;
  height?: number;
  width?: number;
  radius?: string;
  animate?: boolean;
  imageStyle?: MantineStyleProp;
}

export const ImageComponent: FC<ImageComponentProps> = ({
  index,
  item,
  onClick,
  active,
  height = 100,
  width,
  radius = 'md',
  animate = false,
  imageStyle,
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

  if (item === '') {
    return (
      <Image
        alt={`Image ${index + 1}`}
        src={'/media/cover_placeholder.png'}
        radius={radius}
        h={height}
        fit="cover"
        onClick={onClick}
        className={active ? styles.image_component : ''}
        style={imageStyle}
      />
    );
  }

  if (!data || item === '') {
    return (
      <Skeleton
        animate={animate}
        height={height}
        radius={radius}
        width={width}
      />
    );
  }

  return (
    <Image
      alt={`Image ${index + 1}`}
      src={data}
      radius={radius}
      h={height}
      fit="cover"
      onClick={onClick}
      className={active ? styles.image_component : ''}
      style={imageStyle}
    />
  );
};
