import { useLocale } from '@hooks/useLocale';
import { Editor } from '@tiptap/react';
import { Modal, Select } from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { useState } from 'react';

import styles from './LatexModal.module.css';
import { ComboboxItem } from '@mantine/core';

const insertCodeBlock = ({
  editor,
  language,
  defaultLanguage,
}: {
  editor: Editor;
  language: ComboboxItem | null;
  defaultLanguage: string;
}) => {
  if (language === null || language.label === defaultLanguage) {
    editor?.chain().setCodeBlock().run();
  } else {
    editor?.chain().setCodeBlock({ language: language.value }).run();
  }
};

export const CodeBlockModal = ({
  isOpened,
  close,
  languages,
  editor,
}: {
  isOpened: boolean;
  close: any;
  languages: any[];
  editor: Editor;
}) => {
  const [input, setInput] = useState<ComboboxItem | null>(null);

  const onClose = () => {
    close();
  };

  const languagesForSelect: ComboboxItem[] = languages.flatMap(
    (language: any) => [
      {
        label: language.nameAsString,
        value: language.name,
      },
    ]
  );

  const setInputByString = (value: string | null) => {
    for (let i = 0; i < languages.length; i++) {
      if (languagesForSelect[i].value === value) {
        setInput(languagesForSelect[i]);
      }
    }
  };

  const { locale } = useLocale();

  return (
    <Modal opened={isOpened} onClose={onClose} withCloseButton={false}>
      <div className={styles.latex_modal_body}>
        <span className={styles.title}>
          {locale.tiptap.chooseProgrammingLanguage}
        </span>
        <Select
          disabled={false}
          placeholder={locale.tiptap.chooseProgrammingLanguage}
          classNames={{
            label: styles.label,
          }}
          clearable={false}
          allowDeselect={false}
          size="lg"
          data={languagesForSelect}
          onChange={(value: string | null) => setInputByString(value)}
          defaultValue={
            languagesForSelect.filter(
              (language) => language.label === locale.tiptap.defaultLanguage
            )[0].value
          }
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
    </Modal>
  );
};
