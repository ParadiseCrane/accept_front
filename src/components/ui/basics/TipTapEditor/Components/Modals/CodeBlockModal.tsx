import { useState } from 'react';
import styles from './LatexModal.module.css';
import { Editor } from '@tiptap/react';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { Select } from '@ui/basics';
import { IProgrammingLanguage } from '@custom-types/data/tiptap';
import { useLocale } from '@hooks/useLocale';

const insertCodeBlock = ({
  editor,
  language,
}: {
  editor: Editor;
  language: IProgrammingLanguage | null;
}) => {
  const { locale } = useLocale();
  if (
    language === null ||
    language.nameAsString === locale.tiptap.defaultLanguage
  ) {
    editor?.chain().setCodeBlock().run();
  } else {
    editor?.chain().setCodeBlock({ language: language.name }).run();
  }
};

export const CodeBlockModal = ({
  isOpened,
  close,
  lowlight,
  languages,
  editor,
}: {
  isOpened: boolean;
  close: any;
  lowlight: any;
  languages: IProgrammingLanguage[];
  editor: Editor;
}) => {
  const [input, setInput] = useState<IProgrammingLanguage | null>(null);

  const onClose = () => {
    close();
  };

  const setInputByString = (nameAsString: string) => {
    for (let i = 0; i < languages.length; i++) {
      if (languages[i].nameAsString === nameAsString) {
        setInput(languages[i]);
      }
    }
  };

  const { locale } = useLocale();

  return (
    <SimpleModal opened={isOpened} close={onClose}>
      <div className={styles.latex_modal_body}>
        <span className={styles.title}>
          {locale.tiptap.chooseProgrammingLanguage}
        </span>
        <Select
          label={locale.tiptap.language}
          disabled={false}
          placeholder={locale.tiptap.chooseProgrammingLanguage}
          classNames={{
            label: styles.label,
          }}
          size="lg"
          data={languages.flatMap((language: IProgrammingLanguage) => [
            {
              value: language.nameAsString,
              additionalValue: language.name,
            },
          ])}
          onChange={(nameAsString: string) => setInputByString(nameAsString)}
          {...lowlight}
        />
        <SimpleButtonGroup
          reversePositive={false}
          actionButton={{
            onClick: () => {
              insertCodeBlock({ editor: editor, language: input });

              onClose();
            },
            label: locale.tiptap.insert,
          }}
          cancelButton={{ onClick: onClose, label: locale.tiptap.close }}
        />
      </div>
    </SimpleModal>
  );
};
