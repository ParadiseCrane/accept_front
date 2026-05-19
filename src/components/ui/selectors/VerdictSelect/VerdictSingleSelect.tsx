"use client";
import { ComboboxItem } from "@mantine/core";
import { Select } from "@ui/basics";
import { FC, memo, useCallback, useMemo } from "react";

import { VerdictItemProps, VerdictSelectProps } from "./VerdictSelect";
import { IVerdict } from "@custom-types/data/atomic";

interface Props extends VerdictSelectProps {
  verdicts: IVerdict[];
}

const VerdictSingleSelect: FC<Props> = ({
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
    (spec: string | null) => {
      if (!spec) {
        select(undefined);
        return;
      }
      const verdictIndex = verdicts.findIndex(
        (item) => item.spec.toString() === spec,
      );
      if (verdictIndex >= 0) {
        select([verdicts[verdictIndex]]);
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
        filter={({ options, search }) =>
          (options as ComboboxItem[]).filter(
            (item) =>
              item.label?.toLowerCase().includes(search.toLowerCase().trim()) ||
              item.value.toLowerCase().includes(search.toLowerCase().trim()),
          )
        }
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
