import { MathExtension } from '@aarkue/tiptap-math-extension';
import { ImageResize } from 'tiptap-extension-resize-image';
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
import { useEditor, BubbleMenu, Editor } from '@tiptap/react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { all, createLowlight } from 'lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import csharp from 'highlight.js/lib/languages/csharp';
import html from 'highlight.js/lib/languages/xml';
import styles from './TipTapEditor.module.css';
import { InsertLatexExpression } from './Components/InsertLatex';
import { ToggleBold } from './Components/ToggleBold';
import { ToggleItalic } from './Components/ToggleItalic';
import { ToggleUnderline } from './Components/ToggleUnderline';
import { ToggleStrikethrough } from './Components/ToggleStrikethrough';
import { InsertImageAsFile, InsertImageAsUrl } from './Components/InsertImage';
import { ToggleBulletList, ToggleOrderedList } from './Components/ToggleList';
import {
  ToggleSubscript,
  ToggleSuperscript,
} from './Components/ToggleSubSuper';
import { ToggleBlockquote } from './Components/ToggleBlockquote';
import {
  AlignCenterButton,
  AlignJustifyButton,
  AlignLeftButton,
  AlignRightButton,
} from './Components/Align';
import { RedoButton, UndoButton } from './Components/UndoRedoClear';
import {
  ToggleHeading1,
  ToggleHeading2,
  ToggleHeading3,
  ToggleHeading4,
} from './Components/ToggleHeadings';
import { useState } from 'react';
import { Edit, FileExport } from 'tabler-icons-react';
import { LinkButton, UnlinkButton } from './Components/LinkButton';
import { ToggleCodeBlock } from './Components/ToggleCodeBlock';
import { IProgrammingLanguage } from '@custom-types/data/tiptap';

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p>RichTextEditor component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. RichTextEditor is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

const lowlight = createLowlight(all);

const languages: IProgrammingLanguage[] = [
  { nameAsString: 'Default', name: 'html', nameAsFn: html },
  { nameAsString: 'HTML', name: 'html', nameAsFn: html },
  { nameAsString: 'CSS', name: 'css', nameAsFn: css },
  { nameAsString: 'JavaScript', name: 'js', nameAsFn: js },
  { nameAsString: 'TypeScript', name: 'ts', nameAsFn: ts },
  { nameAsString: 'Python', name: 'python', nameAsFn: python },
  { nameAsString: 'C#', name: 'csharp', nameAsFn: csharp },
];

const registerLanguages = () => {
  for (let i = 0; i < languages.length; i++) {
    lowlight.register(languages[i].nameAsString, languages[i].nameAsFn);
  }
};

registerLanguages();

const ExportContentForEditor = ({ editor }: { editor: Editor }) => {
  return (
    <Edit
      stroke={'black'}
      size={'1rem'}
      onClick={() => {
        console.log('for editor', editor.getHTML());
      }}
    />
  );
};

const ExportContentForHTML = ({ editor }: { editor: Editor }) => {
  return (
    <FileExport
      stroke={'black'}
      size={'1rem'}
      onClick={() => {
        console.log('for HTML', editor.$doc.element.getHTML());
      }}
    />
  );
};

export const TipTapEditor = () => {
  const [data, setData] = useState(``);

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
      Highlight,
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
  });

  return (
    <div>
      <RichTextEditor editor={editor}>
        {editor && (
          <RichTextEditor.Toolbar
            sticky
            stickyOffset={60}
            className={styles.toolbar}
          >
            <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
              <ToggleBold editor={editor} />
              <ToggleItalic editor={editor} />
              <ToggleUnderline editor={editor} />
              <ToggleStrikethrough editor={editor} />
              <RichTextEditor.ClearFormatting />
              <ToggleCodeBlock
                editor={editor}
                lowlight={lowlight}
                languages={languages}
              />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
              <InsertLatexExpression editor={editor} />
              <InsertImageAsFile editor={editor} />
              <InsertImageAsUrl editor={editor} />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
              <ToggleHeading1 editor={editor} />
              <ToggleHeading2 editor={editor} />
              <ToggleHeading3 editor={editor} />
              <ToggleHeading4 editor={editor} />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
              <ToggleBlockquote editor={editor} />
              <ToggleBulletList editor={editor} />
              <ToggleOrderedList editor={editor} />
              <ToggleSubscript editor={editor} />
              <ToggleSuperscript editor={editor} />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
              <LinkButton editor={editor} />
              <UnlinkButton editor={editor} />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
              <AlignLeftButton editor={editor} />
              <AlignCenterButton editor={editor} />
              <AlignRightButton editor={editor} />
              <AlignJustifyButton editor={editor} />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
              <UndoButton editor={editor} />
              <RedoButton editor={editor} />
              <ExportContentForEditor editor={editor} />
              <ExportContentForHTML editor={editor} />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        )}
        <RichTextEditor.Content className={styles.content} />
      </RichTextEditor>
      <div
        dangerouslySetInnerHTML={{
          __html: data,
        }}
      />
    </div>
  );
};
