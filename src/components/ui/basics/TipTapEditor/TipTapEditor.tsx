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

const loadImageAsFile = ({
  files,
  editor,
}: {
  files: FileList | null;
  editor: Editor;
}) => {
  const reader = new FileReader();
  reader.onload = function () {
    if (typeof reader.result === 'string') {
      // return reader.result;
      editor?.chain().focus().setImage({ src: reader.result }).run();
    }
    return '';
  };
  if (files !== null) {
    reader.readAsDataURL(files[0]);
  }
};

const loadImageFromUrl = ({ src, editor }: { src: string; editor: Editor }) => {
  editor
    .chain()
    .setImage({ src: src, alt: 'Uploaded image', title: 'Uploaded image' })
    .run();
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
      <Tex stroke={'black'} size={'1rem'} />
    </RichTextEditor.Control>
  );
};

const InsertImageAsFile = ({ editor }: { editor: Editor }) => {
  return (
    <RichTextEditor.Control aria-label="Upload image" title="Upload image">
      <input
        type="file"
        accept={'image/*'}
        className="Input__input"
        onChange={(e) =>
          loadImageAsFile({ files: e.target.files, editor: editor })
        }
        style={{ display: 'none' }}
        id="upload-image-as-file"
      />
      <label
        htmlFor="upload-image-as-file"
        style={{ display: 'flex', flexDirection: 'column' }}
        className={styles.upload_image}
      >
        <PhotoUp size={'1rem'} />
      </label>
    </RichTextEditor.Control>
  );
};

const InsertImageByUrl = ({ editor }: { editor: Editor }) => {
  return (
    <RichTextEditor.Control
      onClick={() => {
        loadImageFromUrl({
          editor: editor,
          src: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
        });
      }}
      aria-label="Upload image from URL"
      title="Upload image from URL"
    >
      <PhotoSearch size={'1rem'} />
    </RichTextEditor.Control>
  );
};

const CustomBold = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isActive('bold');
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleMark('bold').run();
      }}
      aria-label="Toggle bold"
      title="Toggle bold"
    >
      <BoldIcon style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};

const CustomItalic = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isActive('italic');
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleItalic().run();
      }}
      aria-label="Toggle italic"
      title="Toggle italic"
    >
      <ItalicIcon style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};

const ViewState = ({ editor }: { editor: Editor }) => {
  return (
    <RichTextEditor.Control
      onClick={() => {
        console.log(editor.view.state.selection);
      }}
      aria-label="View state"
      title="View state"
    >
      <Eye size={'1rem'} />
    </RichTextEditor.Control>
  );
};

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
            <ViewState editor={editor} />
            <CustomBold editor={editor} />
            <CustomItalic editor={editor} />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <InsertLatexExpression
              editor={editor}
              expression="$x^n + y^n = z^n$"
            />
            <InsertImageAsFile editor={editor} />
            <InsertImageByUrl editor={editor} />
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
      )}

      <RichTextEditor.Content className={styles.content} />
    </RichTextEditor>
  );
};
