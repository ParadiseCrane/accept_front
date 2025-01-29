import { MathExtension } from '@aarkue/tiptap-math-extension';
import { useLocale } from '@hooks/useLocale';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Code } from '@tiptap/extension-code';
import { CodeBlock } from '@tiptap/extension-code-block';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Color } from '@tiptap/extension-color';
import { Document } from '@tiptap/extension-document';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { FloatingMenu } from '@tiptap/extension-floating-menu';
import { Heading } from '@tiptap/extension-heading';
import { Highlight } from '@tiptap/extension-highlight';
import { History } from '@tiptap/extension-history';
import { Image } from '@tiptap/extension-image';
import { Italic } from '@tiptap/extension-italic';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Strike } from '@tiptap/extension-strike';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Text } from '@tiptap/extension-text';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { Editor, useEditor } from '@tiptap/react';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { all, createLowlight } from 'lowlight';
import { useState } from 'react';
import { Edit, FileExport } from 'tabler-icons-react';
import { ImageResize } from 'tiptap-extension-resize-image';

import { AlignGroupCollapsed, AlignGroupSeparate } from './Components/Align';
import { ClearFormattingButton } from './Components/ClearFormattingButton';
// import { IProgrammingLanguage } from '@custom-types/data/tiptap';
import { ColorPickerButton } from './Components/ColorPickerButton';
import { HighLightColorButton } from './Components/HighlightColorButton';
import { InsertGroupSeparate } from './Components/InsertGroup';
import { LinkButton, UnlinkButton } from './Components/LinkButton';
import { ToggleBlockquote } from './Components/ToggleBlockquote';
import { ToggleBold } from './Components/ToggleBold';
import {
  HeadingsGroupCollapsed,
  HeadingsGroupSeparate,
} from './Components/ToggleHeadings';
import { ToggleItalic } from './Components/ToggleItalic';
import { ToggleBulletList, ToggleOrderedList } from './Components/ToggleList';
import { ToggleStrikethrough } from './Components/ToggleStrikethrough';
import {
  ToggleSubscript,
  ToggleSuperscript,
} from './Components/ToggleSubSuper';
import { ToggleUnderline } from './Components/ToggleUnderline';
import { ToolbarDivider } from './Components/ToolbarDivider';
import { RedoButton, UndoButton } from './Components/UndoRedo';
import styles from './TipTapEditor.module.css';

export const imageInsertFunction = ({
  src,
  alt,
  width,
}: {
  src: string;
  alt: string;
  width: string;
}): string => {
  return `<img src="${src}" alt="${alt}" style="width: ${width}; height: auto; cursor: pointer; display: block" title="${alt}" draggable="true" display="block">`;
};

export const TipTapEditor = ({
  editorMode,
  content,
  form,
  name,
  onUpdate,
  onBlur,
}: {
  editorMode: boolean;
  content: string;
  form?: any;
  name?: any;
  onUpdate: (editor: Editor) => void;
  onBlur?: any;
}) => {
  const lowlight = createLowlight(all);

  const { locale } = useLocale();

  const languages = [
    {
      nameAsString: locale.tiptap.defaultLanguage,
      name: 'default',
      nameAsFn: null,
    },
    { nameAsString: 'HTML', name: 'html', nameAsFn: html },
    { nameAsString: 'CSS', name: 'css', nameAsFn: css },
    { nameAsString: 'JavaScript', name: 'js', nameAsFn: js },
    { nameAsString: 'TypeScript', name: 'ts', nameAsFn: ts },
    { nameAsString: 'Python', name: 'python', nameAsFn: python },
    { nameAsString: 'C#', name: 'csharp', nameAsFn: csharp },
  ];

  const registerLanguages = () => {
    for (let i = 1; i < languages.length; i++) {
      lowlight.register(languages[i].nameAsString, languages[i].nameAsFn!);
    }
  };

  registerLanguages();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      MathExtension.configure({ evaluation: false }),
      ImageResize,
      Blockquote,
      Link,
      Bold,
      BulletList,
      Code,
      CodeBlock,
      CodeBlockLowlight.configure({
        lowlight: lowlight,
      }),
      Color,
      Document,
      Dropcursor,
      FloatingMenu,
      Heading,
      Highlight.configure({ multicolor: true }),
      History,
      Image,
      Italic,
      ListItem,
      OrderedList,
      Paragraph,
      Strike,
      Subscript,
      Superscript,
      Text,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Underline,
    ],
    content,
    editable: editorMode ? true : false,
    onUpdate: () => {
      onUpdate(editor!);
    },
    onBlur: onBlur,
    // onUpdate: () => {
    //   const data = editor?.getHTML();
    //   form.setFieldValue(name, data);
    // },
    // onBlur: () => {
    //   form.validateField(name);
    // },
  });

  const outlineClass = editorMode ? 'outline-tiptap' : '';

  return (
    <RichTextEditor editor={editor}>
      {editorMode && editor && (
        <RichTextEditor.Toolbar
          sticky={true}
          stickyOffset={60}
          className={styles.toolbar}
        >
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <ToggleBold editor={editor} />
            <ToggleItalic editor={editor} />
            <ToggleUnderline editor={editor} />
            <ToggleStrikethrough editor={editor} />
            <ClearFormattingButton editor={editor} />
            <ColorPickerButton editor={editor} />
            <HighLightColorButton editor={editor} />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <ToolbarDivider />
            <InsertGroupSeparate
              editor={editor}
              className={styles.insert_group_separate}
              lowlight={lowlight}
              languages={languages}
            />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <ToolbarDivider />
            <HeadingsGroupSeparate
              editor={editor}
              className={styles.headings_group_separate}
            />
            <HeadingsGroupCollapsed
              editor={editor}
              className={styles.headings_group_collapsed}
            />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <ToolbarDivider />
            <ToggleBlockquote editor={editor} />
            <ToggleBulletList editor={editor} />
            <ToggleOrderedList editor={editor} />
            <ToggleSubscript editor={editor} />
            <ToggleSuperscript editor={editor} />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <ToolbarDivider />
            <LinkButton editor={editor} />
            <UnlinkButton editor={editor} />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <ToolbarDivider />
            <AlignGroupSeparate
              editor={editor}
              className={styles.align_group_separate}
            />
            <AlignGroupCollapsed
              editor={editor}
              className={styles.align_group_collapsed}
            />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <ToolbarDivider />
            <UndoButton editor={editor} />
            <RedoButton editor={editor} />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      )}
      <RichTextEditor.Content className={`${styles.content} ${outlineClass}`} />
    </RichTextEditor>
  );
};
