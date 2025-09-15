"use client";
import { useLocale } from "@hooks/useLocale";
import {
  Button,
  SegmentedControl,
  Image,
  Slider,
  Stack,
  Text,
  Textarea,
  LoadingOverlay,
  Modal,
} from "@mantine/core";
import { useState, useCallback, useMemo } from "react";
import { sendRequest } from "@requests/request";
import { Editor } from "@tiptap/react";
import { base64ToFileList, uploadImageAsFile } from "@utils/image";

export const GenerateImageModal = ({
  isOpened,
  close,
  editor,
}: {
  isOpened: boolean;
  close: any;
  editor: Editor;
}) => {
  const { locale } = useLocale();

  const [amount, setAmount] = useState<number | undefined>(3);
  const [desc, setDesc] = useState<string>(editor.getText());
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);

  const [currentImage, setCurrentImage] = useState("0");

  const items = useMemo(
    () =>
      Array.from({ length: images.length }).map((_, index) => ({
        label: `${locale.tiptap.imageGeneration.variant} ${index + 1}`,
        value: `${index}`,
      })),
    [images.length],
  );

  const send = useCallback(
    (desc: string) => {
      setLoading(true);
      sendRequest<{ amount: number; desc: string }, string[]>(
        "ai/generate_image",
        "POST",
        {
          amount: amount || 3,
          desc: desc,
        },
      )
        .then((resp) => {
          setLoading(false);
          if (resp.error) return [];
          setCurrentImage("0");
          setImages(
            resp.response.map((base64) => `data:image/png;base64,${base64}`),
          );
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [amount],
  );

  const uploadImage = useCallback(() => {
    if (images.length == 0) return;
    setUploading(true);
    uploadImageAsFile({
      files: base64ToFileList(images[+currentImage]),
      editor,
      locale,
      timeout: 5000,
      width: `${32 * 16}px`,
    }).finally(() => setUploading(false));
  }, [currentImage, images]);

  return (
    <Modal
      opened={isOpened}
      onClose={close}
      title={locale.tiptap.imageGeneration.title}
      withCloseButton={true}
      size={"lg"}
      styles={{ title: { fontSize: "var(--font-size-xl)" } }}
    >
      <Stack gap={"xl"} pos={"relative"} mx={"md"} mb={"md"}>
        <Stack>
          <Text size="lg">{locale.tiptap.imageGeneration.amountLabel}</Text>
          <Slider
            restrictToMarks
            marks={Array.from({ length: 5 }).map((_, index) => ({
              value: index + 1,
              label: index + 1,
            }))}
            label={null}
            value={amount}
            onChange={setAmount}
            min={1}
            max={5}
          />
        </Stack>
        <Stack>
          <Text size="lg">{locale.tiptap.imageGeneration.description}</Text>
          <Textarea
            size="lg"
            placeholder={locale.tiptap.imageGeneration.placeholder}
            minRows={3}
            maxRows={6}
            autosize
            value={desc}
            onChange={(event) => setDesc(event.currentTarget.value)}
          />
        </Stack>
        <Button
          disabled={desc.trim().length == 0}
          variant="outline"
          size="md"
          fullWidth
          onClick={() => send(desc.trim())}
        >
          {locale.generate}
        </Button>

        {items.length > 0 && (
          <Stack align="center" w={"100%"}>
            {items.length > 1 && (
              <SegmentedControl
                size="md"
                variant="outline"
                value={currentImage}
                onChange={setCurrentImage}
                data={items}
              />
            )}
            <Image src={images[+currentImage]} />
            <Button
              size="lg"
              variant="outline"
              color="green"
              fullWidth
              disabled={items.length == 0 || loading}
              onClick={uploadImage}
              loading={uploading}
            >
              {locale.tiptap.insert}
            </Button>
          </Stack>
        )}
        <LoadingOverlay visible={loading} />
      </Stack>
    </Modal>
  );
};
