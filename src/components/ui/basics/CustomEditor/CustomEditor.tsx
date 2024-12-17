import { useLocale } from '@hooks/useLocale';
import { FC, ReactNode, memo, useEffect, useRef, useState } from 'react';
import { InputWrapper } from '@ui/basics';
import { TipTapEditor } from '../TipTapEditor/TipTapEditor';
import { Editor as EditorType } from '@tiptap/react';

const CustomEditor: FC<{
  name: string;
  label: string;
  form?: any;

  helperContent?: string | ReactNode;
  shrink?: boolean;
}> = ({ name, label, form, helperContent, shrink }) => {
  const { locale } = useLocale();

  return (
    <div>
      <InputWrapper
        label={label}
        helperContent={helperContent}
        shrink={shrink}
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
        />
      </InputWrapper>
    </div>
  );
};

export default memo(CustomEditor);
