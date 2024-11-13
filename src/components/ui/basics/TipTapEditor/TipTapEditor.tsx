import { MathExtension } from '@aarkue/tiptap-math-extension';
import { ImageResize } from 'tiptap-extension-resize-image';
import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Code } from '@tiptap/extension-code';
import { CodeBlock } from '@tiptap/extension-code-block';
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
import { PhotoUp, PhotoSearch, Tex } from 'tabler-icons-react';
import styles from './TipTapEditor.module.css';

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

const insertLatexFunction = ({
  editor,
  expression,
}: {
  editor: Editor;
  expression: string;
}) => {
  const characterFilter = expression.replaceAll('$', '');
  editor?.commands.insertContent(
    `<span data-latex="${characterFilter}" data-evaluate="no" data-display="no" data-type="inlineMath">${expression}</span>`
  );
};

const InsertLatexExpression = ({
  editor,
  expression,
}: {
  editor: Editor;
  expression: string;
}) => {
  return (
    <RichTextEditor.Control
      onClick={() =>
        insertLatexFunction({ editor: editor, expression: expression })
      }
      aria-label="Insert LaTeX expression"
      title="Insert LaTeX expression"
    >
      <Tex stroke={'black'} />
    </RichTextEditor.Control>
  );
};

const InsertImage = ({ editor }: { editor: Editor }) => {
  return (
    <RichTextEditor.Control
      onClick={() => {}}
      aria-label="Upload image"
      title="Upload image"
    >
      <PhotoUp />
    </RichTextEditor.Control>
  );
};

const InsertTable = ({ editor }: { editor: Editor }) => {
  return (
    <RichTextEditor.Control
      onClick={() => {}}
      aria-label="Upload image from URL"
      title="Upload image from URL"
    >
      <PhotoSearch />
    </RichTextEditor.Control>
  );
};

export const TipTapEditor = () => {
  const editor = useEditor({
    extensions: [
      MathExtension.configure({ evaluation: true }),
      ImageResize,
      Blockquote,
      Link,
      Bold,
      BulletList,
      Code,
      CodeBlock,
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
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar
        sticky
        stickyOffset={60}
        className={styles.toolbar}
      >
        <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
          {editor && (
            <>
              <InsertLatexExpression
                editor={editor}
                expression="$x^n + y^n = z^n$"
              />
              <InsertImage editor={editor} />
              <InsertTable editor={editor} />
            </>
          )}
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
          <RichTextEditor.Blockquote />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content className={styles.content} />
    </RichTextEditor>
  );
};
