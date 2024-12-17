import { useState } from 'react';
import styles from './LatexModal.module.css';
import { Editor } from '@tiptap/react';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { Select } from '@ui/basics';
import { useLocale } from '@hooks/useLocale';

const insertCodeBlock = ({
  editor,
  language,
  defaultLanguage,
}: {
  editor: Editor;
  language: any | null;
  defaultLanguage: string;
}) => {
  if (language === null || language.nameAsString === defaultLanguage) {
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
  languages: any[];
  editor: Editor;
}) => {
  const [input, setInput] = useState<any | null>(null);

  const onClose = () => {
    close();
  };

  const setInputByString = (nameAsString: string | null) => {
    for (let i = 0; i < languages.length; i++) {
      if (languages[i].nameAsString === nameAsString) {
        setInput(languages[i]);
      }
    }
  };

  const { locale } = useLocale();

  const languagesForSelect = languages.flatMap((language: any) => [
    {
      value: language.nameAsString,
      additionalValue: language.name,
    },
  ]);

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
          data={languagesForSelect}
          onChange={(nameAsString: string) => setInputByString(nameAsString)}
          defaultValue={locale.tiptap.defaultLanguage}
          {...lowlight}
        />
        <SimpleButtonGroup
          reversePositive={false}
          actionButton={{
            onClick: () => {
              insertCodeBlock({
                editor: editor,
                language: input,
                defaultLanguage: locale.tiptap.defaultLanguage,
              });
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
