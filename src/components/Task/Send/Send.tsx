import { Button, Select } from '@ui/basics';
import {
  FC,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocale } from '@hooks/useLocale';
import CodeArea from '@ui/CodeArea/CodeArea';
import { requestWithNotify } from '@utils/requestWithNotify';
import { capitalize } from '@utils/capitalize';
import { setter } from '@custom-types/ui/atomic';
import styles from './send.module.css';
import { Send as SendPlane } from 'tabler-icons-react';
import { ILanguage } from '@custom-types/data/atomic';
import { useLocalStorage } from '@mantine/hooks';
import { MAX_CODE_LENGTH } from '@constants/Limits';
import { MyHoverCardDropdownProps } from '@custom-types/ui/basics/button';

const Send: FC<{
  spec: string;
  setActiveTab: setter<string | undefined>;
  languages: ILanguage[];
  kbdHelperContent?: ReactNode;
  buttonDropdownProps?: MyHoverCardDropdownProps;
}> = ({
  spec,
  setActiveTab,
  languages,
  kbdHelperContent,
  buttonDropdownProps,
}) => {
  const { locale, lang } = useLocale();

  const [language, setLanguage] = useLocalStorage<string>({
    key: 'previous_program_lang',
    defaultValue: languages.length > 0 ? languages[0].spec.toString() : '1',
  });

  useEffect(() => {
    if (!languages.map((item) => item.spec.toString()).includes(language)) {
      setLanguage(languages[0].spec.toString());
    }
  }, [language, languages, setLanguage]);

  const [code, setCode] = useState('');

  const handleSubmit = useCallback(() => {
    const body = {
      task: spec,
      language: Number(language),
      programText: code,
      textAnswers: [],
    };
    requestWithNotify(
      'attempt/submit',
      'POST',
      locale.notify.attempt.send,
      lang,
      (_: {}) => '',
      body,
      () => {},
      { autoClose: 5000 }
    );
    setCode('');
    setActiveTab('results');
  }, [language, code, spec, locale, lang, setActiveTab]);

  const onLangSelect = useCallback(
    (value: string | null) => {
      if (value) setLanguage(value);
    },
    [setLanguage]
  );

  const isValid = useMemo(
    () => code.trim().length > 0 && code.length < MAX_CODE_LENGTH,
    [code]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Select
          label={locale.language}
          onChange={onLangSelect}
          value={language}
          classNames={{
            root: styles.selectWrapper,
          }}
          data={languages.map((lang) => ({
            label: capitalize(lang.name),
            value: lang.spec.toString(),
          }))}
        />

        <Button
          variant="outline"
          onClick={handleSubmit}
          disabled={!isValid}
          dropdownContent={
            !isValid ? (
              <div>
                {locale.helpers.task.send
                  .invalidCodeAnswer(MAX_CODE_LENGTH)
                  .map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
              </div>
            ) : (
              kbdHelperContent
            )
          }
          hoverCardDropdownProps={buttonDropdownProps}
          leftSection={
            <SendPlane color={!isValid ? 'black' : 'var(--primary)'} />
          }
        >
          {locale.task.submit}
        </Button>
      </div>
      <CodeArea
        label={''}
        languages={languages}
        setLanguage={setLanguage}
        setCode={setCode}
        formProps={{ value: code }}
        classNames={{
          root: styles.codeArea,
          wrapper: styles.codeArea,
          input: styles.codeArea,
        }}
        onSend={handleSubmit}
      />
    </div>
  );
};

export default memo(Send);
