"use client";
import { useLocale } from "@hooks/useLocale";
import { Editor } from "@tiptap/react";
import { Modal, Select, TextInput } from "@ui/basics";
import SimpleButtonGroup from "@ui/SimpleButtonGroup/SimpleButtonGroup";
import { useState } from "react";

import styles from "./AddCalloutModal.module.css";
import { ComboboxItem } from "@mantine/core";
import { ILocale } from "@custom-types/ui/ILocale";

const insertCallout = ({
  editor,
  type,
  locale,
}: {
  editor: Editor;
  type: ComboboxItem | null;
  locale: ILocale;
}) => {
  editor
    ?.chain()
    .focus()
    .insertContent({
      type: "aside",
      attrs: {
        type: type?.value ?? "warning",
      },
      content: [
        {
          type: "callout_title",
          content: [
            {
              type: "text",
              text: locale.tiptap.getCalloutTitleByType(
                type?.value ?? "warning",
              ),
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: locale.tiptap.calloutDefaultContent,
            },
          ],
        },
      ],
    })
    .run();
};

export const AddCalloutModal = ({
  isOpened,
  close,
  types,
  editor,
}: {
  isOpened: boolean;
  close: any;
  types: any[];
  editor: Editor;
}) => {
  const [input, setInput] = useState<ComboboxItem | null>(null);

  const onClose = () => {
    close();
  };

  const typesForSelect: ComboboxItem[] = types.flatMap((type: any) => [
    {
      label: type.label,
      value: type.value,
    },
  ]);

  const setInputByString = (value: string | null) => {
    for (let i = 0; i < types.length; i++) {
      if (typesForSelect[i].value === value) {
        setInput(typesForSelect[i]);
      }
    }
  };

  const { locale } = useLocale();

  return (
    <Modal opened={isOpened} onClose={onClose} withCloseButton={false}>
      <div className={styles.add_callout_modal_body}>
        <span className={styles.title}>{locale.tiptap.chooseCalloutType}</span>
        <Select
          disabled={false}
          placeholder={locale.tiptap.chooseCalloutType}
          classNames={{
            label: styles.label,
          }}
          clearable={false}
          allowDeselect={false}
          size="lg"
          data={typesForSelect}
          onChange={(value: string | null) => setInputByString(value)}
          defaultValue={typesForSelect[0].value}
        />
        <SimpleButtonGroup
          reversePositive={false}
          actionButton={{
            onClick: () => {
              insertCallout({
                editor: editor,
                type: input,
                locale,
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
