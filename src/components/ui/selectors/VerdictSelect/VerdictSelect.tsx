import { ComponentPropsWithoutRef, FC, memo } from "react";

import VerdictMultiSelect from "./VerdictMultiSelect";
import VerdictSingleSelect from "./VerdictSingleSelect";
import { IVerdict } from "@custom-types/data/atomic";
import { useLocale } from "@hooks/useLocale";

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
  select: (_: IVerdict[] | undefined) => void;
  additionalProps?: any;
  multiple?: boolean;
}

const VerdictSelect: FC<VerdictSelectProps> = ({ multiple, ...props }) => {
  const { locale } = useLocale();

  // const verdicts: IVerdict[] = [
  //   {
  //     spec: 0,
  //     fullText: "Accepted",
  //     shortText: "OK",
  //   },
  //   {
  //     spec: 1,
  //     fullText: "Time Limit",
  //     shortText: "TL",
  //   },
  //   {
  //     spec: 2,
  //     fullText: "Wrong Answer",
  //     shortText: "WA",
  //   },
  //   {
  //     spec: 3,
  //     fullText: "Compilation Error",
  //     shortText: "CE",
  //   },
  //   {
  //     spec: 4,
  //     fullText: "Runtime Error",
  //     shortText: "RE",
  //   },
  //   {
  //     spec: 5,
  //     fullText: "Server Error",
  //     shortText: "SE",
  //   },
  //   {
  //     spec: 6,
  //     fullText: "Not Tested",
  //     shortText: "NT",
  //   },
  //   {
  //     spec: 7,
  //     fullText: "Memory Limit Exceeded",
  //     shortText: "ML",
  //   },
  //   {
  //     spec: 8,
  //     fullText: "Checker Error",
  //     shortText: "CH",
  //   },
  // ];

  const verdicts: IVerdict[] = [0, 1, 2, 3].map((_, index) => ({
    spec: index,
    label: locale.attempt.statuses[index],
    fullText: locale.attempt.statuses[index],
    shortText: locale.attempt.statuses[index],
  }));

  if (multiple) return <VerdictMultiSelect verdicts={verdicts} {...props} />;
  return <VerdictSingleSelect verdicts={verdicts} {...props} />;
};

export default memo(VerdictSelect);
