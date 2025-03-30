import { ILanguage } from '@custom-types/data/atomic';
import { IAttempt } from '@custom-types/data/IAttempt';
// @ts-ignore
import { useLocale } from '@hooks/useLocale';
import { CodeHighlight } from '@mantine/code-highlight';
import { FC, memo } from 'react';

import styles from './code.module.css';

const getLang = (language: ILanguage): any => {
  switch (language.shortName) {
    case 'cpp':
      return 'cpp';
    case 'python':
      return 'python';
    case 'pypy':
      return 'python';
    case 'java':
      return 'java';
    case 'pascal':
      return 'pascal';
    case 'rust':
      return 'rust';
    case 'go':
      return 'go';
    case 'nodejs':
      return 'javascript';
    case 'cobol':
      return 'cobol';
    case 'fortran':
      return 'fortran';
    case 'csharp':
      return 'csharp';
    case 'haskell':
      return 'haskell';
    case 'lua':
      return 'lua';
    default:
      return '';
  }
};

const Code: FC<{ attempt: IAttempt }> = ({ attempt }) => {
  const { locale } = useLocale();

  return (
    <div className={styles.codeWrapper}>
      <CodeHighlight
        language={getLang(attempt.language)}
        copyLabel={locale.copy.label}
        copiedLabel={locale.copy.done}
        code={attempt.programText}
      >
        {attempt.programText}
      </CodeHighlight>
    </div>
  );
};

export default memo(Code);
