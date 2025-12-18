import clsx from "clsx";
import { Group, Button } from "@mantine/core";
import { Editor } from "@tiptap/react";
import { useCallback, useState } from "react";
import { useTipTapBubbleMenu } from "@hooks/useTipTapBubbleMenu";
import TextArea from "@ui/basics/TextArea/TextArea";
import { useLocale } from "@hooks/useLocale";
import Overlay from "@ui/basics/Overlay/Overlay";
import styles from "./StylizeTextModal.module.css";
import SimpleButtonGroup from "@ui/SimpleButtonGroup/SimpleButtonGroup";

interface Props {
  editor: Editor;
}

export const StylizeTextModal = ({ editor }: Props) => {
  const defaultStyle = "Сказка о царе Салтане";
  const { locale } = useLocale();
  const [style, setStyle] = useState(defaultStyle);
  const {
    isModalVisible,
    setModalVisible,
    selectedRange,
    getStylizedText,
    isEditable,
  } = useTipTapBubbleMenu();

  const stylizeText = useCallback(async () => {
    const from = selectedRange.from;
    const to = selectedRange.to;
    if (from && to) {
      const processedText = await getStylizedText({
        style,
        selectedText: editor.state.doc.textBetween(from, to, "\n", ""),
      });

      editor.chain().focus().insertContentAt({ from, to }, processedText).run();
    }
  }, [editor, selectedRange, getStylizedText]);

  return (
    <>
      <Overlay
        color="#000"
        backgroundOpacity={0.35}
        blur={25}
        classNames={{
          root: clsx(!isModalVisible && styles.invisible),
        }}
      />
      <div
        className={clsx(
          styles.modalWrapper,
          !isModalVisible && styles.invisible
        )}
      >
        <div className={clsx(styles.modal)}>
          <Group gap="sm" p="sm">
            <TextArea
              label={locale.tiptap.stylize.labelSelected}
              placeholder={locale.tiptap.stylize.placeholder}
              minRows={3}
              value={style}
              onChange={(event) => setStyle(event.currentTarget.value)}
              disabled={!isEditable}
            />
            <SimpleButtonGroup
              reversePositive={false}
              actionButton={{
                onClick: stylizeText,
                label: locale.apply,
                props: { disabled: !isEditable },
              }}
              cancelButton={{
                onClick: () => setModalVisible(false),
                label: locale.close,
                props: { disabled: !isEditable },
              }}
            />
          </Group>
        </div>
      </div>
    </>
  );
};
