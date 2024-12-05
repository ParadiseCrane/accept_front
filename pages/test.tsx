import { DefaultLayout } from '@layouts/DefaultLayout';
import { Editor } from '@tiptap/core';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { ReactElement } from 'react';

function TestPage() {
  return (
    <div
      style={{
        padding: '20px 100px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <TipTapEditor
        editorMode={true}
        content={
          // '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p>RichTextEditor component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. RichTextEditor is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul><h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p>RichTextEditor component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. RichTextEditor is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul><h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p>RichTextEditor component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. RichTextEditor is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul><h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p>RichTextEditor component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. RichTextEditor is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul><h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p>RichTextEditor component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. RichTextEditor is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>'
          ''
        }
        onUpdate={() => {}}
      />
    </div>
  );
}
TestPage.getLayout = (page: ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
export default TestPage;
