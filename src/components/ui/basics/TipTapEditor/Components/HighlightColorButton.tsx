import { Menu } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Highlight as HighlightIcon } from 'tabler-icons-react';
import { ColorPickerModal } from './Modals/ColorPickerModal';
import { IconWrapper } from './IconWrapper';

export const HighLightColorButton = ({ editor }: { editor: Editor }) => {
  const initialColor = editor.getAttributes('textStyle')['color'] ?? '#ffffff';

  const changeColor = (color: string) => {
    editor.chain().focus().setHighlight({ color: color }).run();
  };

  return (
    <Menu shadow="md" position="bottom-start" withArrow>
      <Menu.Target>
        <RichTextEditor.Control
          aria-label="Highlight text"
          title="Highlight text"
        >
          <IconWrapper isActive={false} IconChild={HighlightIcon} />
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
