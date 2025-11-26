"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type TipTapEditableContextType = {
  isEditable: boolean;
  setEditable: (newValue: boolean) => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const TipTapEditableContext = createContext<
  TipTapEditableContextType | undefined
>(undefined);

export const TipTapEditableProvider = ({
  children,
}: AuthContextProviderProps) => {
  const [isEditable, setIsEditable] = useState<boolean>(true);

  const setEditable = (value: boolean) => {
    setIsEditable(value);
  };

  return (
    <TipTapEditableContext.Provider
      value={{
        isEditable,
        setEditable,
      }}
    >
      {children}
    </TipTapEditableContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTipTapEditable = () => {
  const context = useContext(TipTapEditableContext);
  if (!context) {
    throw new Error(
      "useTipTapEditable must be used within a TipTapEditableProvider",
    );
  }
  return context;
};
