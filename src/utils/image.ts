"use client";
import { Editor } from "@tiptap/react";
import { ILocale } from "@custom-types/ui/ILocale";

export const imageInsertFunctionTipTap = ({
  src,
  alt,
  width,
}: {
  src: string;
  alt: string;
  width: string;
}): string => {
  return `<img src="${src}" alt="${alt}" style="width: ${width}; height: auto; cursor: pointer; display: block" title="${alt}" draggable="true" display="block">`;
};
export const uploadImageAsFile = async ({
  files,
  editor,
  timeout,
  locale,
  width,
}: {
  files: FileList | null;
  editor: Editor;
  timeout: number;
  locale: ILocale;
  width: string;
}) => {
  if (!files?.length) return;

  const formData = new FormData();
  formData.append("upload", files[0]);

  try {
    const response = await fetch("/api/image", {
      method: "POST",
      body: formData,
    });

    const json = await response.json();
    const src = json.url || "/media/placeholder.jpg";

    editor
      .chain()
      .insertContent(
        imageInsertFunctionTipTap({
          src,
          alt: locale.tiptap.imageAltTitle,
          width,
        }),
      )
      .run();
  } catch (error) {
    editor
      .chain()
      .insertContent(
        imageInsertFunctionTipTap({
          src: "/media/placeholder.jpg",
          alt: locale.tiptap.imageUploadFail,
          width,
        }),
      )
      .run();
  }
};

export const base64ToFileList = (
  base64String: string,
  filename: string = "image.png",
): FileList => {
  // Convert base64 to blob
  const byteString = atob(base64String.split(",")[1]);
  const mimeString = base64String.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });

  // Create file from blob
  const file = new File([blob], filename, { type: mimeString });

  // Create FileList using DataTransfer
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);

  return dataTransfer.files;
};
