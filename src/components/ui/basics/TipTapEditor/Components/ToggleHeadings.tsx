import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import {
  ChevronDown,
  H1,
  H2,
  H3,
  H4,
  Heading as HeadingIcon,
} from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';
import { HoverCard } from '@mantine/core';
import { useLocale } from '@hooks/useLocale';

export const HeadingsGroupSeparate = ({
  editor,
  className,
}: {
  editor: Editor;
  className: string;
}) => {
  return (
    <div className={className}>
      <ToggleHeading1 editor={editor} />
      <ToggleHeading2 editor={editor} />
      <ToggleHeading3 editor={editor} />
      <ToggleHeading4 editor={editor} />
    </div>
  );
};

export const HeadingsGroupCollapsed = ({
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
            aria-label={locale.tiptap.headings}
            title={locale.tiptap.headings}
          >
            <HeadingIcon size={'1.2rem'} style={{ stroke: '#444746' }} />
            <ChevronDown size={'1.2rem'} style={{ stroke: '#444746' }} />
          </RichTextEditor.Control>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <ToggleHeading1 editor={editor} />
          <ToggleHeading2 editor={editor} />
          <ToggleHeading3 editor={editor} />
          <ToggleHeading4 editor={editor} />
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
};

const ToggleHeading1 = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive('heading', { level: 1 })
    : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleHeading({ level: 1 }).run();
      }}
      aria-label={locale.tiptap.heading1}
      title={locale.tiptap.heading1}
    >
      <IconWrapper isActive={isActive} IconChild={H1} />
    </RichTextEditor.Control>
  );
};

const ToggleHeading2 = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive('heading', { level: 2 })
    : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleHeading({ level: 2 }).run();
      }}
      aria-label={locale.tiptap.heading2}
      title={locale.tiptap.heading2}
    >
      <IconWrapper isActive={isActive} IconChild={H2} />
    </RichTextEditor.Control>
  );
};

const ToggleHeading3 = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive('heading', { level: 3 })
    : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleHeading({ level: 3 }).run();
      }}
      aria-label={locale.tiptap.heading3}
      title={locale.tiptap.heading3}
    >
      <IconWrapper isActive={isActive} IconChild={H3} />
    </RichTextEditor.Control>
  );
};

const ToggleHeading4 = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive('heading', { level: 4 })
    : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleHeading({ level: 4 }).run();
      }}
      aria-label={locale.tiptap.heading4}
      title={locale.tiptap.heading4}
    >
      <IconWrapper isActive={isActive} IconChild={H4} />
    </RichTextEditor.Control>
  );
};
