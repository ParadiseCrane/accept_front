import { ComponentPropsWithoutRef, FC, memo, useCallback } from "react";

import VerdictMultiSelect from "./VerdictMultiSelect";
import VerdictSingleSelect from "./VerdictSingleSelect";
import { IVerdict } from "@custom-types/data/atomic";
import { useLocale } from "@hooks/useLocale";

export interface ISelectorItem {
  spec: string;
  label: string;
}

export interface IItemWithGroup {
  group: string;
  items: ISelectorItem[];
}

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
  statusSelect: (_: number[] | undefined) => void;
  verdictSelect: (_: number[] | undefined) => void;
  additionalProps?: any;
  multiple?: boolean;
}

const VerdictSelect: FC<VerdictSelectProps> = ({ multiple, ...props }) => {
  const { locale } = useLocale();

  const verdicts: ISelectorItem[] = [
    {
      spec: "v0",
      label: "Accepted",
    },
    {
      spec: "v1",
      label: "Time Limit",
    },
    {
      spec: "v2",
      label: "Wrong Answer",
    },
    {
      spec: "v3",
      label: "Compilation Error",
    },
    {
      spec: "v4",
      label: "Runtime Error",
    },
    {
      spec: "v5",
      label: "Server Error",
    },
    {
      spec: "v6",
      label: "Not Tested",
    },
    {
      spec: "v7",
      label: "Memory Limit Exceeded",
    },
    {
      spec: "v8",
      label: "Checker Error",
    },
  ];

  const statuses: ISelectorItem[] = [0, 1, 2, 3].map((item) => ({
    spec: `s${item}`,
    label: locale.attempt.statuses[item],
  }));

  const allItems: IItemWithGroup[] = [
    { group: locale.attempt.status, items: statuses },
    { group: locale.attempt.verdict, items: verdicts },
  ];

  const select = useCallback(
    (values: string[] | undefined) => {
      props.statusSelect(
        values
          ?.filter((item) => item.startsWith("s"))
          .map((item) => parseInt(item.slice(1))),
      );
      props.verdictSelect(
        values
          ?.filter((item) => item.startsWith("v"))
          .map((item) => parseInt(item.slice(1))),
      );
    },
    [props.statusSelect, props.verdictSelect],
  );

  if (multiple)
    return (
      <VerdictMultiSelect select={select} verdicts={allItems} {...props} />
    );
  return <VerdictSingleSelect select={select} verdicts={allItems} {...props} />;
};

export default memo(VerdictSelect);
