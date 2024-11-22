import { ColorPicker as MantineColorPicker } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { ColorPicker as ColorPickerIcon } from 'tabler-icons-react';
import styles from './ColorPicker.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';

export const ColorPickerButton = ({ editor }: { editor: Editor }) => {
  const [show, setShow] = useState(false);
  const initialColor = editor.getAttributes('textStyle')['color'] ?? '#000000';

  return (
    <div className={styles.color_picker_wrapper}>
      <RichTextEditor.Control
        onClick={() => {
          setShow((value) => !value);
        }}
        aria-label="Remove link"
        title="Remove link"
      >
        <ColorPickerIcon size={'1rem'} />
      </RichTextEditor.Control>
      {show && (
        <ColorPickerModal
          editor={editor}
          close={() => setShow(false)}
          initialColor={initialColor}
        />
      )}
    </div>
  );
};

const ColorPickerModal = ({
  editor,
  close,
  initialColor,
}: {
  editor: Editor;
  close: () => void;
  initialColor: string;
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
        onColorSwatchClick={(item) => setColor(item)}
        onChangeEnd={(item) => setColor(item)}
      />
      <SimpleButtonGroup
        reversePositive={false}
        actionButton={{
          onClick: () => {
            editor.chain().focus().setColor(color).run();
            close();
          },
          label: 'Set color',
        }}
        cancelButton={{ onClick: close, label: 'Close' }}
      />
    </div>
  );
};
