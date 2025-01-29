import { IUserDisplay } from '@custom-types/data/IUser';
import { SelectItem } from '@custom-types/ui/atomic';
import { ComboboxItem, Text } from '@mantine/core';
import { MultiSelect, UserAvatar } from '@ui/basics';
import Link from 'next/link';
import React, { FC, forwardRef, memo, useCallback, useMemo } from 'react';
import { Eye } from 'tabler-icons-react';

import { UserItemProps, UserSelectProps } from './UserSelect';
import styles from './userSelect.module.css';

const UserMultiSelect: FC<UserSelectProps> = ({
  label,
  placeholder,
  users,
  nothingFound,
  select,
  multiple,
  additionalProps,
}) => {
  const SelectItem = forwardRef<HTMLDivElement, UserItemProps>(
    ({ login, label, value, ...others }: UserItemProps, ref) => (
      <div className={styles.item} ref={ref}>
        <div
          onMouseDown={others.onMouseDown}
          onMouseEnter={others.onMouseEnter}
          className={styles.left}
        >
          <UserAvatar
            radius="md"
            size="md"
            login={login}
            alt={'User`s avatar'}
          />
          <div>
            <Text size="sm">{label}</Text>
            <Text size="xs" opacity={0.65}>
              {value}
            </Text>
          </div>
        </div>
        <div className={styles.itemIcon}>
          <Link href={`/profile/${value}`}>
            <Eye color={'var(--primary)'} />
          </Link>
        </div>
      </div>
    )
  );
  SelectItem.displayName = 'SelectItem';

  const data = useMemo(
    () =>
      users.map(
        (item) =>
          ({
            login: item.login,
            label: item.shortName,
            value: item.login,
            role: item.role.name,
          }) as UserItemProps
      ),
    [users]
  );

  const onSelect = useCallback(
    (logins: string[]) => {
      if (logins.length == 0) {
        select(undefined);
        return;
      }
      const map = new Map(users.map((item) => [item.login, item]));

      select(logins.map((item) => map.get(item) as IUserDisplay));
    },
    [select, users]
  );

  return (
    <>
      <MultiSelect
        searchable
        data={data}
        itemComponent={SelectItem}
        label={label}
        placeholder={placeholder}
        clearable
        maxDropdownHeight={400}
        nothingFoundMessage={nothingFound}
        filter={({ options, search }) =>
          (options as ComboboxItem[]).filter(
            (item) =>
              item.label?.toLowerCase().includes(search.toLowerCase().trim()) ||
              item.value.toLowerCase().includes(search.toLowerCase().trim())
          )
        }
        {...additionalProps}
        onChange={(logins) => {
          onSelect(logins);
          additionalProps?.onChange(logins);
        }}
      />
    </>
  );
};

export default memo(UserMultiSelect);
