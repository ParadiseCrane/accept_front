"use client";
import { useLocale } from "@hooks/useLocale";
import { Modal } from "@ui/basics";
import SimpleButtonGroup from "@ui/SimpleButtonGroup/SimpleButtonGroup";
import { Group, Image, Stack } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useRequest } from "@hooks/useRequest";
import { useMemo, useState, useCallback, useEffect } from "react";
import { EmblaCarouselType } from "embla-carousel";

const DEFAULT_IMAGES: string[] = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Igel.JPG/250px-Igel.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Hedgehog_in_Jurmala.jpg/250px-Hedgehog_in_Jurmala.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/HandheldHedgeHog.png/250px-HandheldHedgeHog.png",
];

export const GenerateImageModal = ({
  isOpened,
  close,
}: {
  isOpened: boolean;
  close: any;
}) => {
  const { locale } = useLocale();

  const { data: images } = useRequest<
    { amount: number; desc: string },
    string[]
  >(
    "ai/generate_image",
    "POST",
    { amount: 3, desc: "Улыбок тебе дед макар" },
    (images: string[]) =>
      images.map((base64) => `data:image/png;base64,${base64}`),
  );
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  const slides = useMemo(
    () =>
      (images || DEFAULT_IMAGES).map((url, idx) => (
        <Carousel.Slide key={idx}>
          <Image src={url} />
        </Carousel.Slide>
      )) || <></>,
    [images],
  );

  const handleScroll = useCallback(() => {
    if (!embla) {
      return;
    }
    const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
    console.log(progress);
    console.log(embla.slidesInView());
    console.log(embla.scrollSnapList());
    for (let i = 1; i <= slides.length; i++) {
      if (progress < (i * 1) / slides.length) {
        setCurrentImage(i - 1);
        break;
      }
    }
    // setCurrentImage(Math.round(progress*(slides.length-1)));
  }, [embla, setCurrentImage]);

  useEffect(() => {
    if (embla) {
      embla.on("settle", handleScroll);
      handleScroll();
    }
  }, [embla]);

  return (
    <Modal opened={isOpened} onClose={close} withCloseButton={false}>
      <Stack>
        <Carousel
          withIndicators
          emblaOptions={{ loop: true }}
          height="100%"
          flex={1}
          slideGap="sm"
          getEmblaApi={setEmbla}
        >
          {slides}
        </Carousel>
        {currentImage}
        <Group m={"auto"}>
          <SimpleButtonGroup
            reversePositive={false}
            actionButton={{
              onClick: () => {
                setTimeout(() => console.log(currentImage), 2000);
              },
              label: locale.tiptap.insert,
            }}
            cancelButton={{ onClick: close, label: locale.tiptap.close }}
          />
        </Group>
      </Stack>
    </Modal>
  );
};
