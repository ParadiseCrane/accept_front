"use client";
import { ComboboxItem } from "@mantine/core";
import { MultiSelect } from "@ui/basics";
import { FC, memo, useCallback, useMemo } from "react";

import {
  IItemWithGroup,
  VerdictItemProps,
  VerdictSelectProps,
} from "./VerdictSelect";
import { IVerdict } from "@custom-types/data/atomic";

interface Props extends VerdictSelectProps {
  verdicts: IItemWithGroup[];
  select: (_: string[] | undefined) => void;
}

const VerdictMultiSelect: FC<Props> = ({
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
    (labels: string[]) => {
      if (labels.length == 0) {
        select([]);
        return;
      }
      const allItems = verdicts.flatMap((item) => item.items);
      select(
        allItems
          .filter((item) => labels.includes(item.label.toString()))
          .map((item) => item.spec.toString()),
      );
    },
    [select, verdicts],
  );

  return (
    <>
      <MultiSelect
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
        onChange={(specs) => {
          onSelect(specs);
          additionalProps?.onChange(specs);
        }}
      />
    </>
  );
};

export default memo(VerdictMultiSelect);
