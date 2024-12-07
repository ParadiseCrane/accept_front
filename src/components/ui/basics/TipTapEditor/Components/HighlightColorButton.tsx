import { HoverCard } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Highlight as HighlightIcon } from 'tabler-icons-react';
import { ColorPickerModal } from './Modals/ColorPickerModal';
import { IconWrapper } from './IconWrapper';
import { useLocale } from '@hooks/useLocale';

export const HighLightColorButton = ({ editor }: { editor: Editor }) => {
  const initialColor = '#ffffff';

  const changeColor = (color: string) => {
    editor.chain().focus().setHighlight({ color: color }).run();
  };
  const { locale } = useLocale();
  return (
    <HoverCard
      shadow="md"
      position="bottom-start"
      withArrow
      styles={{ dropdown: { padding: '0px' } }}
    >
      <HoverCard.Target>
        <RichTextEditor.Control
          aria-label={locale.tiptap.highlightColor}
          title={locale.tiptap.highlightColor}
        >
          <IconWrapper isActive={false} IconChild={HighlightIcon} />
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
