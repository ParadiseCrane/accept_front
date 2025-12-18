"use client";
import { useLocale } from "@hooks/useLocale";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { IconMessage2Plus } from "@tabler/icons-react";

import { IconWrapper } from "./IconWrapper";
import { AddCalloutModal } from "./Modals/AddCalloutModal";

export const AddCalloutButton = ({
  editor,
  types,
}: {
  editor: Editor;
  types: Array<{ value: string; label: string }>;
}) => {
  const [show, setShow] = useState(false);
  const { locale } = useLocale();

  return (
    <>
      <RichTextEditor.Control
        onClick={() => {
          setShow(true);
        }}
        aria-label={locale.tiptap.callout}
        title={locale.tiptap.callout}
      >
        <IconWrapper isActive={false} IconChild={IconMessage2Plus} />
      </RichTextEditor.Control>
      {show && (
        <AddCalloutModal
          isOpened={show}
          close={() => setShow(false)}
          editor={editor}
          types={types}
        />
      )}
    </>
  );
};
