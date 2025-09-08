"use client";
import { Editor as EditorType } from "@tiptap/react";
import { InputWrapper } from "@ui/basics";
import { FC, ReactNode, memo } from "react";

import { TipTapEditor } from "../TipTapEditor/TipTapEditor";

const CustomEditor: FC<{
  name: string;
  label: string;
  form?: any;
  editorMinHeight?: string;
  helperContent?: string | ReactNode;
  shrink?: boolean;
  required?: boolean;
}> = ({
  name,
  label,
  form,
  editorMinHeight,
  helperContent,
  shrink,
  required,
}) => {
  return (
    <div>
      <InputWrapper
        label={label}
        helperContent={helperContent}
        shrink={shrink}
        required={required}
        {...form.getInputProps(name)}
      >
        <TipTapEditor
          editorMode={true}
          content={form.values[name]}
          form={form}
          onUpdate={(editor: EditorType) => {
            const data = editor.getHTML();
            form.setFieldValue(name, data);
          }}
          onBlur={() => {
            form.validateField(name);
          }}
          minHeight={editorMinHeight}
        />
      </InputWrapper>
    </div>
  );
};

export default memo(CustomEditor);
