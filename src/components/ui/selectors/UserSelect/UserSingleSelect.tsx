import { SelectItem } from '@custom-types/ui/atomic';
import { ComboboxItem, Text } from '@mantine/core';
import { Select, UserAvatar } from '@ui/basics';
import Link from 'next/link';
import React, { FC, forwardRef, memo, useCallback, useMemo } from 'react';
import { Eye } from 'tabler-icons-react';

import { UserItemProps, UserSelectProps } from './UserSelect';
import styles from './userSelect.module.css';

const UserSingleSelect: FC<UserSelectProps> = ({
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
    (login: string | null) => {
      if (!login) {
        select(undefined);
        return;
      }
      const userIndex = users.findIndex((item) => item.login === login);
      if (userIndex >= 0) {
        select([users[userIndex]]);
      }
    },
    [select, users]
  );

  return (
    <>
      <Select
        searchable
        data={data}
        itemComponent={SelectItem}
        label={label}
        placeholder={placeholder}
        clearable
        maxDropdownHeight={400}
        nothingFound={nothingFound}
        filter={({ options, search }) =>
          (options as ComboboxItem[]).filter(
            (item) =>
              item.label?.toLowerCase().includes(search.toLowerCase().trim()) ||
              item.value.toLowerCase().includes(search.toLowerCase().trim())
          )
        }
        {...additionalProps}
        onChange={(login) => {
          onSelect(login);
          additionalProps?.onChange(login);
        }}
      />
    </>
  );
};

export default memo(UserSingleSelect);
