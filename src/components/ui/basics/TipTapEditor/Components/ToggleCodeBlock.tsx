"use client";
import { useLocale } from "@hooks/useLocale";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { IconCode } from "@tabler/icons-react";

import { IconWrapper } from "./IconWrapper";
import { CodeBlockModal } from "./Modals/CodeBlockModal";

export const ToggleCodeBlock = ({
  editor,
  languages,
}: {
  editor: Editor;
  languages: any[];
}) => {
  const isActive = editor.isFocused ? editor.isActive("codeBlock") : false;
  const [show, setShow] = useState(false);
  const { locale } = useLocale();
  return (
    <>
      <RichTextEditor.Control
        onClick={() => {
          if (!isActive) {
            setShow(true);
          } else {
            editor.commands.toggleCodeBlock();
          }
        }}
        aria-label={locale.tiptap.codeBlock}
        title={locale.tiptap.codeBlock}
      >
        <IconWrapper isActive={isActive} IconChild={IconCode} />
      </RichTextEditor.Control>
      <CodeBlockModal
        isOpened={show}
        close={() => setShow(false)}
        languages={languages}
        editor={editor}
      />
    </>
  );
};
