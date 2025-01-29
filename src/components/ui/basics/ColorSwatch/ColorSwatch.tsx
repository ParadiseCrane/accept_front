import {
  ColorSwatch as ColorSwatchCheckbox,
  ColorSwatchProps,
} from '@mantine/core';
import { FC, memo } from 'react';
interface Props extends ColorSwatchProps {
  shrink?: boolean;
}

const ColorSwatch: FC<Props> = ({ shrink, ...props }) => {
  return (
    <div>
      <ColorSwatchCheckbox
        size={shrink ? 16 : 20}
        {...props}
        classNames={{
          ...props.classNames,
        }}
      />
    </div>
  );
};

export default memo(ColorSwatch);
