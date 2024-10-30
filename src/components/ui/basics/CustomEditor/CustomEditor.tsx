import { useLocale } from '@hooks/useLocale';
import { FC, ReactNode, memo, useEffect, useRef, useState } from 'react';
import { InputWrapper } from '@ui/basics';

const editorConfiguration = {
  simpleUpload: {
    uploadUrl: `/api/image`,

    withCredentials: true,
  },
};

const CustomEditor: FC<{
  name: string;
  label: string;
  form?: any;

  helperContent?: string | ReactNode;
  shrink?: boolean;
}> = ({ name, label, form, helperContent, shrink }) => {
  const { locale } = useLocale();

  const editorRef = useRef<any>(null!);
  const { CKEditor, Editor } = editorRef.current || {
    CKEditor: {},
    Editor: {},
  };

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      Editor: require('ckeditor5-custom/build/ckeditor'),
    };
  }, []);

  return (
    <div>
      <InputWrapper
        label={label}
        helperContent={helperContent}
        shrink={shrink}
        {...form.getInputProps(name)}
      >
        {isLoaded ? (
          <CKEditor
            name={name}
            editor={Editor}
            data={form.values[name]}
            config={editorConfiguration}
            onChange={(_: any, editor: any) => {
              const data = editor.getData();
              form.setFieldValue(name, data);
            }}
            onBlur={() => form.validateField(name)}
          />
        ) : (
          <div
            style={{
              fontSize: shrink ? 'var(--font-size-xs)' : 'var(--font-size-s)',
            }}
          >
            {locale.loading + '...'}
          </div>
        )}
      </InputWrapper>
    </div>
  );
};

export default memo(CustomEditor);
