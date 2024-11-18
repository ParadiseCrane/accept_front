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
import {
  PhotoUp,
  PhotoSearch,
  Tex,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Eye,
} from 'tabler-icons-react';
import styles from './TipTapEditor.module.css';
import { InsertLatexExpression } from './Components/InsertLatex';
import { ToggleBold } from './Components/ToggleBold';
import { ToggleItalic } from './Components/ToggleItalic';
import { ToggleUnderline } from './Components/ToggleUnderline';
import { ToggleStrikethrough } from './Components/ToggleStriketrough';
import { ToggleCode } from './Components/ToggleCode';
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
import { RedoButton, UndoButton } from './Components/UndoRedo';
import {
  ToggleHeading1,
  ToggleHeading2,
  ToggleHeading3,
  ToggleHeading4,
} from './Components/ToggleHeadings';

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

export const TipTapEditor = () => {
  const editor = useEditor({
    immediatelyRender: false,
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
            <ToggleCode editor={editor} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <InsertLatexExpression
              editor={editor}
              expression="$x^n + y^n = z^n$"
            />
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
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
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
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      )}

      <RichTextEditor.Content className={styles.content} />
    </RichTextEditor>
  );
};
