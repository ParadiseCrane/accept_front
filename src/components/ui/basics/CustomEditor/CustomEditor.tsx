"use client";
import { Editor as EditorType } from "@tiptap/react";
import { InputWrapper } from "@ui/basics";
import { FC, ReactNode, memo } from "react";

import { TipTapEditor } from "../TipTapEditor/TipTapEditor";
import { Text } from "@mantine/core";
import { ErrorBoundary } from "react-error-boundary";
import { useLocale } from "@hooks/useLocale";

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
  const { locale } = useLocale();
  return (
    <div>
      <InputWrapper
        label={label}
        helperContent={helperContent}
        shrink={shrink}
        required={required}
        {...form.getInputProps(name)}
      >
        <ErrorBoundary
          fallback={
            <Text ta="center" size="xl">
              {locale.tiptap.error}
            </Text>
          }
        >
          <div style={{ position: "relative" }}>
            <TipTapEditor
              editorMode={true}
              content={form.values[name]}
              onUpdate={(editor: EditorType) => {
                const data = editor.getHTML();
                form.setFieldValue(name, data);
              }}
              onBlur={() => {
                form.validateField(name);
              }}
              minHeight={editorMinHeight}
            />
          </div>
        </ErrorBoundary>
      </InputWrapper>
    </div>
  );
};

export default memo(CustomEditor);
