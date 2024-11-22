import { ColorPicker as MantineColorPicker, Menu } from '@mantine/core';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import styles from './ColorPickerModal.module.css';

export const ColorPickerModal = ({
  initialColor,
  changeColor,
}: {
  editor: Editor;
  initialColor: string;
  changeColor: (color: string) => void;
}) => {
  const [color, setColor] = useState(initialColor);

  return (
    <div className={styles.color_picker_modal_wrapper}>
      <MantineColorPicker
        swatchesPerRow={9}
        format="hex"
        swatches={[
          '#000000',
          '#2e2e2e',
          '#868e96',
          '#FF0000',
          '#fa5252',
          '#e64980',
          '#be4bdb',
          '#7950f2',
          '#4c6ef5',
          '#0000FF',
          '#228be6',
          '#15aabf',
          '#12b886',
          '#40c057',
          '#82c91e',
          '#FFFF00',
          '#fab005',
          '#fd7e14',
        ]}
        value={color}
        onColorSwatchClick={(item) => {
          setColor(item);
          changeColor(item);
        }}
        onChangeEnd={(item) => {
          setColor(item);
          changeColor(item);
        }}
      />
    </div>
  );
};
