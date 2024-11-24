import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import {
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustified as AlignJustifyIcon,
  ChevronDown,
} from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';
import { HoverCard } from '@mantine/core';
import { useLocale } from '@hooks/useLocale';

export const AlignGroupSeparate = ({
  editor,
  className,
}: {
  editor: Editor;
  className: string;
}) => {
  return (
    <div className={className}>
      <AlignLeftButton editor={editor} />
      <AlignCenterButton editor={editor} />
      <AlignRightButton editor={editor} />
      <AlignJustifyButton editor={editor} />
    </div>
  );
};

export const AlignGroupCollapsed = ({
  editor,
  className,
}: {
  editor: Editor;
  className: string;
}) => {
  const { locale } = useLocale();
  return (
    <div className={className}>
      <HoverCard
        shadow="md"
        position="bottom-start"
        withArrow
        styles={{ dropdown: { padding: '3px' } }}
      >
        <HoverCard.Target>
          <RichTextEditor.Control
            aria-label={locale.tiptap.align}
            title={locale.tiptap.align}
          >
            <AlignLeftIcon size={'1.2rem'} style={{ stroke: '#444746' }} />
            <ChevronDown size={'1.2rem'} style={{ stroke: '#444746' }} />
          </RichTextEditor.Control>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <AlignLeftButton editor={editor} />
          <AlignCenterButton editor={editor} />
          <AlignRightButton editor={editor} />
          <AlignJustifyButton editor={editor} />
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
};

const AlignLeftButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'left' })
    : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('left').run();
      }}
      aria-label={locale.tiptap.alignLeft}
      title={locale.tiptap.alignLeft}
    >
      <IconWrapper isActive={isActive} IconChild={AlignLeftIcon} />
    </RichTextEditor.Control>
  );
};

const AlignCenterButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'center' })
    : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('center').run();
      }}
      aria-label={locale.tiptap.alignCenter}
      title={locale.tiptap.alignCenter}
    >
      <IconWrapper isActive={isActive} IconChild={AlignCenterIcon} />
    </RichTextEditor.Control>
  );
};

const AlignRightButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'right' })
    : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('right').run();
      }}
      aria-label={locale.tiptap.alignRight}
      title={locale.tiptap.alignRight}
    >
      <IconWrapper isActive={isActive} IconChild={AlignRightIcon} />
    </RichTextEditor.Control>
  );
};

const AlignJustifyButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'justify' })
    : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('justify').run();
      }}
      aria-label={locale.tiptap.alignJustify}
      title={locale.tiptap.alignJustify}
    >
      <IconWrapper isActive={isActive} IconChild={AlignJustifyIcon} />
    </RichTextEditor.Control>
  );
};
