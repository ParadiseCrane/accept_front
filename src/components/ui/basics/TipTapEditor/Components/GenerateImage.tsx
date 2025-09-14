"use client";
import { useLocale } from "@hooks/useLocale";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { IconPhotoSpark } from "@tabler/icons-react";

import { IconWrapper } from "./IconWrapper";
import { GenerateImageModal } from "./Modals/GenerateImageModal";

export const GenerateImage = ({ editor }: { editor: Editor }) => {
  const [opened, setOpened] = useState(false);
  const { locale } = useLocale();
  return (
    <>
      <RichTextEditor.Control
        aria-label={locale.tiptap.latex}
        title={locale.tiptap.latex}
        onClick={() => {
          setOpened(true);
        }}
      >
        <IconWrapper isActive={false} IconChild={IconPhotoSpark} />
      </RichTextEditor.Control>
      <GenerateImageModal
        isOpened={opened}
        close={() => {
          setOpened(false);
        }}
      />
    </>
  );
};
