import { useLocale } from '@hooks/useLocale';
import { HoverCard } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { ColorPicker as ColorPickerIcon } from 'tabler-icons-react';

import { IconWrapper } from './IconWrapper';
import { ColorPickerModal } from './Modals/ColorPickerModal';

export const ColorPickerButton = ({ editor }: { editor: Editor }) => {
  const initialColor = editor.getAttributes('textStyle')['color'] ?? '#000000';
  const { locale } = useLocale();

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
          aria-label={locale.tiptap.fontColor}
          title={locale.tiptap.fontColor}
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
