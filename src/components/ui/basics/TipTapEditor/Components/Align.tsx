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
            aria-label="Toggle align"
            title="Toggle align"
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
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('left').run();
      }}
      aria-label="Align left"
      title="Align left"
    >
      <IconWrapper isActive={isActive} IconChild={AlignLeftIcon} />
    </RichTextEditor.Control>
  );
};

const AlignCenterButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'center' })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('center').run();
      }}
      aria-label="Align center"
      title="Align center"
    >
      <IconWrapper isActive={isActive} IconChild={AlignCenterIcon} />
    </RichTextEditor.Control>
  );
};

const AlignRightButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'right' })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('right').run();
      }}
      aria-label="Align right"
      title="Align right"
    >
      <IconWrapper isActive={isActive} IconChild={AlignRightIcon} />
    </RichTextEditor.Control>
  );
};

const AlignJustifyButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'justify' })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('justify').run();
      }}
      aria-label="Align justify"
      title="Align justify"
    >
      <IconWrapper isActive={isActive} IconChild={AlignJustifyIcon} />
    </RichTextEditor.Control>
  );
};
