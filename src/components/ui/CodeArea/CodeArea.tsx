import {
  FC,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useLocale } from '@hooks/useLocale';
import styles from './codeArea.module.css';
import { callback } from '@custom-types/ui/atomic';
import {
  errorNotification,
  newNotification,
  successNotification,
} from '@utils/notificationFunctions';
import { ILanguage } from '@custom-types/data/atomic';
import { extensionValidator } from '@utils/extensionValidator';
import { Dropzone, TextArea } from '@ui/basics';
import { MyButtonProps } from '@custom-types/ui/basics/button';

const CodeArea: FC<{
  label: string;
  setLanguage: callback<string, void>;
  languages: ILanguage[];
  setCode: callback<string, void>;
  formProps?: any;
  classNames?: object;
  helperContent?: string | ReactNode;
  buttonProps?: MyButtonProps;
  minRows?: number;
  placeholder?: string | ReactNode;
}> = ({
  label,
  setLanguage,
  languages,
  setCode,
  formProps,
  classNames,
  helperContent,
  buttonProps,
  minRows,
  placeholder,
}) => {
  const { locale } = useLocale();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textAreaRef.current) return;
    let ref = textAreaRef.current;
    const keydownCodeArea = (e: KeyboardEvent) => {
      if (document.activeElement != ref) {
        return;
      }
      if (e.key == 'Tab') {
        e.preventDefault();
        if (!ref) return;
        let start = ref.selectionStart;
        let end = ref.selectionEnd;

        let value = ref.value;
        ref.value = `${value.substring(0, start)}\t${value.substring(
          end
        )}`;
        ref.selectionStart = start + 1;
        ref.selectionEnd = start + 1;
      }
    };
    ref.addEventListener('keydown', keydownCodeArea);

    return () => {
      ref.removeEventListener('keydown', keydownCodeArea);
    };
  }, [textAreaRef]);

  const onDrop = useCallback(
    (files: File[]) => {
      const id = newNotification({
        autoClose: 2000,
        title: locale.ui.codeArea.notification.uploading.title,
        message:
          locale.ui.codeArea.notification.uploading.description,
      });
      if (!files[0]) {
        errorNotification({
          id,
          title: locale.ui.codeArea.notification.error.title,
          message: locale.ui.codeArea.notification.error.description,
          autoClose: 5000,
        });
        return;
      }
      const language: string | undefined = extensionValidator(
        files[0].name,
        languages
      );
      if (!language) {
        errorNotification({
          id,
          title: locale.ui.codeArea.notification.reject.title,
          message: locale.ui.codeArea.notification.reject.description,
          autoClose: 5000,
        });
        return;
      }
      setLanguage(language);
      files[0].text().then((res) => setCode(res));
      successNotification({
        id,
        title: locale.ui.codeArea.notification.success.title,
        message: locale.ui.codeArea.notification.success.description,
        autoClose: 2000,
      });
    },
    [languages, locale, setCode, setLanguage]
  );

  return (
    <div className={styles.codeWrapper}>
      <Dropzone
        onDrop={onDrop}
        title={locale.ui.codeArea.dragFiles}
        description={''}
        showButton
        buttonProps={buttonProps}
      >
        <div className={styles.inner}>
          <TextArea
            label={label}
            inputRef={textAreaRef}
            helperContent={helperContent}
            classNames={classNames}
            placeholder={placeholder || locale.placeholders.code}
            onChange={(e) => setCode(e.target.value)}
            minRows={minRows || 20}
            {...formProps}
          />
        </div>
      </Dropzone>
    </div>
  );
};

export default memo(CodeArea);
