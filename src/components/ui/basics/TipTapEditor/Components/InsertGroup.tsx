import { Editor } from '@tiptap/react';

import { InsertImageAsFile, InsertImageAsUrl } from './InsertImage';
import { InsertLatexExpression } from './InsertLatex';
import { ToggleCodeBlock } from './ToggleCodeBlock';

export const InsertGroupSeparate = ({
  editor,
  className,
  lowlight,
  languages,
}: {
  editor: Editor;
  className: string;
  lowlight: any;
  languages: any[];
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
