import { HoverCard } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { ColorPicker as ColorPickerIcon } from 'tabler-icons-react';
import { ColorPickerModal } from './Modals/ColorPickerModal';
import { IconWrapper } from './IconWrapper';

export const ColorPickerButton = ({ editor }: { editor: Editor }) => {
  const initialColor = editor.getAttributes('textStyle')['color'] ?? '#000000';

  const changeColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <HoverCard
      shadow="md"
      position="bottom-start"
      withArrow
      styles={{ dropdown: { padding: '0px' } }}
    >
      <HoverCard.Target>
        <RichTextEditor.Control
          aria-label="Change font color"
          title="Change font color"
        >
          <IconWrapper isActive={false} IconChild={ColorPickerIcon} />
        </RichTextEditor.Control>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <ColorPickerModal
          editor={editor}
          initialColor={initialColor}
          changeColor={changeColor}
        />
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
