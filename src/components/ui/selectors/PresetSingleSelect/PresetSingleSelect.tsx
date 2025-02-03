import { IImagePreset } from '@custom-types/data/IImagePreset';
import { useLocale } from '@hooks/useLocale';
import { ComboboxItem } from '@mantine/core';
import { Select } from '@ui/basics';
import React, { FC, memo } from 'react';

export interface PresetSelectProps {
  label: string;
  presets: IImagePreset[];
  select: (_: IImagePreset) => void;
}

const PresetSingleSelect: FC<PresetSelectProps> = ({
  label,
  presets,
  select,
}) => {
  const data = presets.map(
    (item) =>
      ({
        label: item.name,
        value: item.name,
      }) as ComboboxItem
  );
  const { locale } = useLocale();
  return (
    <Select
      searchable
      data={data}
      label={locale.course.selectImagePreset}
      placeholder={locale.course.presetName}
      clearable
      maxDropdownHeight={400}
      nothingFoundMessage={locale.course.presetNotFound}
      filter={({ options, search }) =>
        (options as ComboboxItem[]).filter(
          (item) =>
            item.label?.toLowerCase().includes(search.toLowerCase().trim()) ||
            item.value.toLowerCase().includes(search.toLowerCase().trim())
        )
      }
      onChange={(value) => {
        select(presets.filter((item) => item.name === value)[0]);
      }}
    />
  );
};

export default memo(PresetSingleSelect);
