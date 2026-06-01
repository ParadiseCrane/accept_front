"use client";
import { ComboboxItem } from "@mantine/core";
import { Select } from "@ui/basics";
import { FC, memo, useCallback, useMemo } from "react";

import {
  IItemWithGroup,
  VerdictItemProps,
  VerdictSelectProps,
} from "./VerdictSelect";

interface Props extends VerdictSelectProps {
  verdicts: IItemWithGroup[];
  select: (_: string[] | undefined) => void;
}

const VerdictSingleSelect: FC<Props> = ({
  label,
  placeholder,
  verdicts,
  nothingFound,
  select,
  additionalProps,
}) => {
  const data = useMemo(
    () =>
      verdicts.map((item) => ({
        group: item.group,
        items: item.items.map((item) => item.label),
      })),
    [verdicts],
  );

  const onSelect = useCallback(
    (label: string | null) => {
      if (!label) {
        select(undefined);
        return;
      }
      const allItems = verdicts.flatMap((item) => item.items);
      const verdictIndex = allItems.findIndex(
        (item) => item.label.toString() === label,
      );
      if (verdictIndex >= 0) {
        select([allItems[verdictIndex].spec]);
      }
    },
    [select, verdicts],
  );

  return (
    <>
      <Select
        searchable
        data={data}
        label={label}
        placeholder={placeholder}
        clearable
        maxDropdownHeight={400}
        nothingFoundMessage={nothingFound}
        // filter={({ options, search }) =>
        //   (options as ComboboxItem[]).filter(
        //     (item) =>
        //       item.label?.toLowerCase().includes(search.toLowerCase().trim()) ||
        //       item.value.toLowerCase().includes(search.toLowerCase().trim()),
        //   )
        // }
        {...additionalProps}
        onChange={(spec) => {
          onSelect(spec);
          additionalProps?.onChange(spec);
        }}
      />
    </>
  );
};

export default memo(VerdictSingleSelect);
