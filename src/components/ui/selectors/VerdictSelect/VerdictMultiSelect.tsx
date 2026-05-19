"use client";
import { ComboboxItem } from "@mantine/core";
import { MultiSelect } from "@ui/basics";
import { FC, memo, useCallback, useMemo } from "react";

import { VerdictItemProps, VerdictSelectProps } from "./VerdictSelect";
import { IVerdict } from "@custom-types/data/atomic";

interface Props extends VerdictSelectProps {
  verdicts: IVerdict[];
}

const VerdictMultiSelect: FC<Props> = ({
  label,
  placeholder,
  verdicts,
  nothingFound,
  select,
  multiple,
  additionalProps,
}) => {
  const data = useMemo(
    () =>
      verdicts.map(
        (item) =>
          ({
            label: item.fullText,
            value: item.spec.toString(),
          }) as VerdictItemProps,
      ),
    [verdicts],
  );

  const onSelect = useCallback(
    (specs: string[]) => {
      if (specs.length == 0) {
        select([]);
        return;
      }
      select(verdicts.filter((item) => specs.includes(item.spec.toString())));
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
        filter={({ options, search }) =>
          (options as ComboboxItem[]).filter(
            (item) =>
              item.label?.toLowerCase().includes(search.toLowerCase().trim()) ||
              item.value.toLowerCase().includes(search.toLowerCase().trim()),
          )
        }
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
