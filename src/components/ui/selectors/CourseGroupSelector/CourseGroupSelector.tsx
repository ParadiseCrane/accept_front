import { IGroupBaseInfo } from '@custom-types/data/IGroup';
import { useLocale } from '@hooks/useLocale';
import { ComboboxItem } from '@mantine/core';
import { Select } from '@ui/basics';
import React, { FC, memo } from 'react';

export interface CourseGroupSelectProps {
  groups: IGroupBaseInfo[];
  currentGroup: IGroupBaseInfo | null;
  select: (_: IGroupBaseInfo) => void;
}

const CourseGroupSingleSelect: FC<CourseGroupSelectProps> = ({
  groups,
  currentGroup,
  select,
}) => {
  const data = groups.map(
    (item) =>
      ({
        label: item.name,
        value: item.name,
      }) as ComboboxItem
  );
  const { locale } = useLocale();
  return (
    <Select
      defaultValue={data.length > 0 ? data[0].value : ''}
      searchable
      data={data}
      value={currentGroup ? currentGroup.name : null}
      label={locale.course.selectGroup}
      placeholder={locale.course.groupName}
      clearable={false}
      maxDropdownHeight={400}
      nothingFoundMessage={locale.course.groupNotFound}
      filter={({ options, search }) =>
        (options as ComboboxItem[]).filter(
          (item) =>
            item.label?.toLowerCase().includes(search.toLowerCase().trim()) ||
            item.value.toLowerCase().includes(search.toLowerCase().trim())
        )
      }
      onChange={(value) => {
        select(groups.filter((item) => item.name === value)[0]);
      }}
    />
  );
};

export default memo(CourseGroupSingleSelect);
