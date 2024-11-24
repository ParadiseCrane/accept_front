import { Editor } from '@tiptap/react';
import { InsertImageAsFile, InsertImageAsUrl } from './InsertImage';
import { InsertLatexExpression } from './InsertLatex';
import { ToggleCodeBlock } from './ToggleCodeBlock';
import { HoverCard } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { ChevronDown, CirclePlus } from 'tabler-icons-react';
import { IProgrammingLanguage } from '@custom-types/data/tiptap';

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

export const InsertGroupCollapsed = ({
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
      <HoverCard
        shadow="md"
        position="bottom-start"
        withArrow
        styles={{ dropdown: { padding: '3px' } }}
      >
        <HoverCard.Target>
          <RichTextEditor.Control aria-label="Insert" title="Insert">
            <CirclePlus size={'1.2rem'} style={{ stroke: '#444746' }} />
            <ChevronDown size={'1.2rem'} style={{ stroke: '#444746' }} />
          </RichTextEditor.Control>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <ToggleCodeBlock
            editor={editor}
            lowlight={lowlight}
            languages={languages}
          />
          <InsertLatexExpression editor={editor} />
          <InsertImageAsFile editor={editor} />
          <InsertImageAsUrl editor={editor} />
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
};
