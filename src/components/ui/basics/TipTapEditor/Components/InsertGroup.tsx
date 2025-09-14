"use client";
import { Editor } from "@tiptap/react";

import { InsertImageAsFile, InsertImageAsUrl } from "./InsertImage";
import { InsertLatexExpression } from "./InsertLatex";
import { ToggleCodeBlock } from "./ToggleCodeBlock";
import { GenerateImage } from "./GenerateImage";

export const InsertGroupSeparate = ({
  editor,
  className,
  languages,
}: {
  editor: Editor;
  className: string;
  languages: any[];
}) => {
  return (
    <div className={className}>
      <ToggleCodeBlock editor={editor} languages={languages} />
      <InsertLatexExpression editor={editor} />
      <InsertImageAsFile editor={editor} />
      <InsertImageAsUrl editor={editor} />
      <GenerateImage editor={editor} />
    </div>
  );
};
