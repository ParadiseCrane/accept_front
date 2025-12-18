"use client";
import { useLocale } from "@hooks/useLocale";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";
import { useId, useState } from "react";
import { IconPhotoSearch, IconPhotoUp } from "@tabler/icons-react";

import styles from "../TipTapEditor.module.css";
import { IconWrapper } from "./IconWrapper";
import { ImageUrlModal } from "./Modals/ImageUrlModal";
import { uploadImageAsFile } from "@utils/image";

export const InsertImageAsFile = ({ editor }: { editor: Editor }) => {
  const { locale } = useLocale();
  const id = useId();
  return (
    <RichTextEditor.Control
      aria-label={locale.tiptap.imageFile}
      title={locale.tiptap.imageFile}
    >
      <label
        htmlFor={id}
        style={{ display: "flex", flexDirection: "column" }}
        className={styles.upload_image}
      >
        <IconWrapper isActive={false} IconChild={IconPhotoUp} />
      </label>
      <input
        type="file"
        accept={"image/*"}
        className="Input__input"
        onChange={(e) => {
          uploadImageAsFile({
            files: e.target.files,
            editor: editor,
            timeout: 4000,
            locale: locale,
            width: "300px",
          });
        }}
        style={{ display: "none" }}
        id={id}
      />
    </RichTextEditor.Control>
  );
};

export const InsertImageAsUrl = ({ editor }: { editor: Editor }) => {
  const [show, setShow] = useState(false);
  const { locale } = useLocale();
  return (
    <>
      <RichTextEditor.Control
        onClick={() => {
          setShow(true);
        }}
        aria-label={locale.tiptap.imageURL}
        title={locale.tiptap.imageURL}
      >
        <IconWrapper isActive={false} IconChild={IconPhotoSearch} />
      </RichTextEditor.Control>
      {show && (
        <ImageUrlModal
          isOpened={show}
          close={() => setShow(false)}
          editor={editor}
        />
      )}
    </>
  );
};
