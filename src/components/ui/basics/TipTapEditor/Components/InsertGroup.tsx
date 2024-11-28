import { Editor } from '@tiptap/react';
import { InsertImageAsFile, InsertImageAsUrl } from './InsertImage';
import { InsertLatexExpression } from './InsertLatex';
import { ToggleCodeBlock } from './ToggleCodeBlock';
import { HoverCard } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { ChevronDown, CirclePlus } from 'tabler-icons-react';
import { IProgrammingLanguage } from '@custom-types/data/tiptap';
import { useLocale } from '@hooks/useLocale';

export const InsertGroupSeparate = ({
  editor,
  className,
  lowlight,
  languages,
}: {
  editor: Editor;
  className: string;
  lowlight: any;
  languages: IProgrammingLanguage[];
}) => {
  return (
    <div className={className}>
      <ToggleCodeBlock
        editor={editor}
        lowlight={lowlight}
        languages={languages}
      />
      <InsertLatexExpression editor={editor} />
      <InsertImageAsFile editor={editor} />
      <InsertImageAsUrl editor={editor} />
    </div>
  );
};
