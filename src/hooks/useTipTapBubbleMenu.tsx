"use client";

import {
  errorNotification,
  newNotification,
  successNotification,
} from "@utils/notificationFunctions";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { useLocale } from "./useLocale";

type RangeType = { from: number | null; to: number | null };

type TipTapBubbleMenuContextType = {
  isEditable: boolean;
  isModalVisible: boolean;
  setModalVisible: (newValue: boolean) => void;
  selectedRange: RangeType;
  setSelectedRange: (range: RangeType) => void;
  getStylizedText: (props: {
    style: string;
    selectedText: string;
  }) => Promise<string>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const TipTapBubbleMenuContext = createContext<
  TipTapBubbleMenuContextType | undefined
>(undefined);

const processStream = async (response: any) => {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullStory = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const chunk = decoder.decode(value, { stream: true });

    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const jsonStr = line.substring(6);
        try {
          const data = JSON.parse(jsonStr);
          if (data.content) {
            fullStory += data.content;
          }
        } catch {
          continue;
        }
      }
    }
  }
  return fullStory;
};

export const TipTapBubbleMenuProvider = ({
  children,
}: AuthContextProviderProps) => {
  const { locale } = useLocale();
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<RangeType>({
    from: null,
    to: null,
  });

  const setRange = useCallback(
    (range: RangeType) => {
      setSelectedRange(range);
    },
    [setSelectedRange],
  );

  const setModalVisibility = useCallback(
    (value: boolean) => {
      setModalVisible(value);
    },
    [setModalVisible],
  );

  const getStylizedText = useCallback(
    async ({
      style,
      selectedText,
    }: {
      style: string;
      selectedText: string;
    }): Promise<string> => {
      setIsEditable(false);
      let value = "";
      const id = newNotification({
        title: locale.tiptap.stylize.inProgress,
        message: locale.loading + "...",
      });
      try {
        const res = await fetch("/api/ai/text_style", {
          method: "POST",
          body: JSON.stringify({
            style,
            text: selectedText,
          }),
        });

        value = await processStream(res);

        successNotification({
          id,
          title: locale.tiptap.stylize.success,
          autoClose: 5000,
        });
      } catch {
        errorNotification({
          id,
          title: locale.tiptap.stylize.error,
          autoClose: 5000,
        });
      } finally {
        setIsEditable(true);
        setModalVisible(false);
      }
      return value;
    },
    [setModalVisible, setIsEditable, locale],
  );

  return (
    <TipTapBubbleMenuContext.Provider
      value={{
        isEditable,
        isModalVisible,
        setModalVisible: setModalVisibility,
        selectedRange,
        setSelectedRange: setRange,
        getStylizedText,
      }}
    >
      {children}
    </TipTapBubbleMenuContext.Provider>
  );
};

export const useTipTapBubbleMenu = () => {
  const context = useContext(TipTapBubbleMenuContext);
  if (!context) {
    throw new Error(
      "useTipTapEditable must be used within a TipTapEditableProvider",
    );
  }
  return context;
};
