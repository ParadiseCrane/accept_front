import {
  FC,
  ReactNode,
  RefObject,
  memo,
  useCallback,
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
import { getHotkeyHandler } from '@mantine/hooks';

const get_selection = (ref: HTMLTextAreaElement) => {
  let start = ref.selectionStart;
  let end = ref.selectionEnd;
  return [start, end];
};

const find_selected_lines = (
  value: string,
  start: number,
  end: number
) => {
  value = value.trimEnd() + '\n'; // for last line to work properly in case of not having \n at the end
  let rows = value.split('\n');
  let acc_len = 0;
  let row_bounds = [];
  let prev_index = 0;
  let next_index = 0;
  for (let index = 0; index < rows.length; index++) {
    let row_start = acc_len;
    let row_end = acc_len + rows[index].length + 1;

    if (row_start <= start && start < row_end) {
      prev_index = index - 1;
      if (start === end) {
        // special case when cursor placed in begining of line
        end = row_end;
      }
      start = row_start;
    }
    if (row_start < end && end <= row_end) {
      next_index = index + 1;
      end = row_end;
    }

    row_bounds.push([row_start, row_end]);
    acc_len += rows[index].length + 1; // +1 is \n
  }

  let prev_row = [0, 0];
  if (prev_index >= 0) prev_row = row_bounds[prev_index];
  let next_row = [value.length, value.length];
  if (next_index < row_bounds.length)
    next_row = row_bounds[next_index];

  let begining = value.substring(0, prev_row[0]);
  let prev = value.substring(prev_row[0], prev_row[1]);
  let selected = value.substring(start, end);
  let next = value.substring(next_row[0], next_row[1]);
  let ending = value.substring(next_row[1]);

  return [begining, prev, selected, next, ending];
};

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
  onSend?: () => void;
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
  onSend,
}) => {
  const { locale } = useLocale();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const tab = useCallback(() => {
    let ref = textAreaRef.current;
    if (!ref) return;
    let [start, end] = get_selection(ref);

    let value = ref.value;
    ref.value = `${value.substring(0, start)}\t${value.substring(
      end
    )}`;
    ref.selectionStart = start + 1;
    ref.selectionEnd = start + 1;
  }, [textAreaRef]);

  const send_keyboard = useCallback(() => {
    if (onSend) onSend();
  }, [onSend]);

  const brackets = useCallback(
    (open_bracket: string, close_bracket: string) => {
      return () => {
        let ref = textAreaRef.current;
        if (!ref) return;
        let [start, end] = get_selection(ref);

        let value = ref.value;
        ref.value = `${value.substring(
          0,
          start
        )}${open_bracket}${value.substring(
          start,
          end
        )}${close_bracket}${value.substring(end)}`;
        ref.selectionStart = start + 1;
        ref.selectionEnd = end + 1;
      };
    },
    [textAreaRef]
  );

  const row_swap_up = useCallback(() => {
    let ref = textAreaRef.current;
    if (!ref) return;
    let [start, end] = get_selection(ref);

    let result = find_selected_lines(ref.value, start, end);
    if (!result) return;

    let [begining, prev, selected, next, ending] = result;

    ref.value = `${begining}${selected}${prev}${next}${ending}`;

    ref.selectionStart = start - prev.length;
    ref.selectionEnd = end - prev.length;
  }, [textAreaRef]);

  const row_swap_down = useCallback(() => {
    let ref = textAreaRef.current;
    if (!ref) return;
    let [start, end] = get_selection(ref);

    let result = find_selected_lines(ref.value, start, end);
    if (!result) return;

    let [begining, prev, selected, next, ending] = result;

    ref.value = `${begining}${prev}${next}${selected}${ending}`;

    ref.selectionStart = start + next.length;
    ref.selectionEnd = end + next.length;
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
            onKeyDown={getHotkeyHandler([
              ['Tab', tab],
              ['mod+Enter', send_keyboard],
              ['shift+BracketLeft', brackets('{', '}')],
              ['shift+Digit9', brackets('(', ')')],
              ['BracketLeft', brackets('[', ']')],
              ['alt+ArrowUp', row_swap_up],
              ['alt+ArrowDown', row_swap_down],
            ])}
            {...formProps}
          />
        </div>
      </Dropzone>
    </div>
  );
};

export default memo(CodeArea);
