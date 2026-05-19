import { ComponentPropsWithoutRef, FC, memo } from "react";

import VerdictMultiSelect from "./VerdictMultiSelect";
import VerdictSingleSelect from "./VerdictSingleSelect";
import { IVerdict } from "@custom-types/data/atomic";

export interface VerdictItemProps extends ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  role: string;
  value: string;
}

export interface VerdictSelectProps {
  label: string;
  placeholder: string;
  nothingFound: string;
  verdicts: IVerdict[];
  select: (_: IVerdict[] | undefined) => void;
  additionalProps?: any;
  multiple?: boolean;
}

const VerdictSelect: FC<VerdictSelectProps> = ({ multiple, ...props }) => {
  if (multiple) return <VerdictMultiSelect {...props} />;
  return <VerdictSingleSelect {...props} />;
};

export default memo(VerdictSelect);
