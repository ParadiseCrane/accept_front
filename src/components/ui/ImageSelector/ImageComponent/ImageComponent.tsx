import { FC, memo, useEffect, useState } from "react";
import { Image, MantineStyleProp, Skeleton } from "@mantine/core";
import styles from "./styles.module.css";

interface ImageComponentProps {
  index: number;
  item?: string;
  cover?: boolean;
  onClick?: () => void;
  active: boolean;
  height?: number;
  width?: number;
  radius?: string;
  animate?: boolean;
  imageStyle?: MantineStyleProp;
}

export const ImageComponent = memo(function Component({
  index,
  item,
  cover = false,
  onClick,
  active,
  height = 100,
  width,
  radius = "md",
  animate = false,
  imageStyle,
}: ImageComponentProps) {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (item !== "") {
      (async () => {
        const res = await fetch(`/api/image/${item}`);
        if (!res.ok) setError(true);
        const blob = await res.blob();
        setData(URL.createObjectURL(blob));
      })();
    }
  }, [item]);

  if ((!item && cover) || error) {
    return (
      <Image
        alt={`Image ${index + 1}`}
        src={"/media/cover_placeholder.png"}
        radius={radius}
        h={height}
        fit="cover"
        onClick={onClick}
        className={active ? styles.image_component : ""}
        style={imageStyle}
      />
    );
  }

  if (!data || item === "") {
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
      className={active ? styles.image_component : ""}
      style={imageStyle}
    />
  );
});
