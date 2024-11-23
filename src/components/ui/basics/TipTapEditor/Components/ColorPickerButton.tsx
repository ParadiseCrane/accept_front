import { ColorPicker as MantineColorPicker, Menu } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { ColorPicker as ColorPickerIcon } from 'tabler-icons-react';
import styles from './ColorPicker.module.css';
import { ColorPickerModal } from './Modals/ColorPickerModal';
import { IconWrapper } from './IconWrapper';

export const ColorPickerButton = ({ editor }: { editor: Editor }) => {
  const initialColor = editor.getAttributes('textStyle')['color'] ?? '#000000';

  const changeColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <Menu shadow="md" position="bottom-start" withArrow>
      <Menu.Target>
        <RichTextEditor.Control
          aria-label="Change font color"
          title="Change font color"
        >
          <IconWrapper isActive={false} IconChild={ColorPickerIcon} />
        </RichTextEditor.Control>
      </Menu.Target>
      <Menu.Dropdown>
        <ColorPickerModal
          editor={editor}
          initialColor={initialColor}
          changeColor={changeColor}
        />
      </Menu.Dropdown>
    </Menu>
  );
};
