import { ColorPicker as MantineColorPicker, Menu } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { ColorPicker as ColorPickerIcon } from 'tabler-icons-react';
import styles from './ColorPicker.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';

export const ColorPickerButton = ({ editor }: { editor: Editor }) => {
  const initialColor = editor.getAttributes('textStyle')['color'] ?? '#000000';

  return (
    <Menu shadow="md">
      <Menu.Target>
        <RichTextEditor.Control
          aria-label="Change font color"
          title="Change font color"
        >
          <ColorPickerIcon size={'1rem'} />
        </RichTextEditor.Control>
      </Menu.Target>
      <Menu.Dropdown>
        <ColorPickerModal editor={editor} initialColor={initialColor} />
      </Menu.Dropdown>
    </Menu>
  );
};

const ColorPickerModal = ({
  editor,
  initialColor,
}: {
  editor: Editor;
  initialColor: string;
}) => {
  const [color, setColor] = useState(initialColor);

  const changeColor = (color: string) => {
    setColor(color);
    editor.chain().focus().setColor(color).run();
  };

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
        onColorSwatchClick={(item) => changeColor(item)}
        onChangeEnd={(item) => changeColor(item)}
      />
    </div>
  );
};
