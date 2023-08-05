import { FC, memo, useEffect, useState } from 'react';
import CodeArea from '@ui/CodeArea/CodeArea';
import { Select } from '@ui/basics';
import { useLocale } from '@hooks/useLocale';
import styles from './checker.module.css';
import { ILanguage } from '@custom-types/data/atomic';
import { sendRequest } from '@requests/request';
import Tests from '../Tests/Tests';

const defaultLangSpec = '0';

const Checker: FC<{ form: any }> = ({ form }) => {
  const { locale } = useLocale();
  const [languages, setLanguages] = useState<ILanguage[]>([]);

  useEffect(() => {
    sendRequest<{}, ILanguage[]>(
      'language',
      'GET',
      undefined,
      60000
    ).then((res) => {
      if (!res.error) {
        setLanguages(res.response);
      }
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.checkerWrapper}>
        <Select
          label={locale.language}
          value={defaultLangSpec}
          data={languages.map((lang) => ({
            label: lang.name,
            value: lang.spec.toString(),
          }))}
          required
          onBlur={() => form.validateField('checkerLang')}
          {...form.getInputProps('checkerLang')}
        />
        <CodeArea
          languages={languages}
          minRows={15}
          helperContent={
            <div>
              {locale.helpers.task.checker.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          }
          label={locale.task.form.checker}
          setLanguage={(value) =>
            form.setFieldValue('checkerLang', value)
          }
          setCode={(value) =>
            form.setFieldValue('checkerCode', value)
          }
          formProps={{
            ...form.getInputProps('checkerCode'),
          }}
          placeholder={locale.helpers.task.checkerPlaceholder}
        />
      </div>
      <Tests />
    </div>
  );
};

export default memo(Checker);
