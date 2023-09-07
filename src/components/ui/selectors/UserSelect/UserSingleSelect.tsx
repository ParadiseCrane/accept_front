import React, {
  FC,
  forwardRef,
  memo,
  useCallback,
  useMemo,
} from 'react';
import { Text } from '@mantine/core';
import { Select, UserAvatar } from '@ui/basics';
import { Eye } from 'tabler-icons-react';
import styles from './userSelect.module.css';
import Link from 'next/link';
import { UserItemProps, UserSelectProps } from './UserSelect';

const UserSingleSelect: FC<UserSelectProps> = ({
  label,
  placeholder,
  users,
  nothingFound,
  select,
  multiple, //eslint-disable-line
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
          } as UserItemProps)
      ),
    [users]
  );

  const onSelect = useCallback(
    (login: string | null) => {
      if (!login) {
        select(undefined);
        return;
      }
      const userIndex = users.findIndex(
        (item) => item.login === login
      );
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
        filter={(value, item) =>
          item.label
            ?.toLowerCase()
            .includes(value.toLowerCase().trim()) ||
          item.value
            .toLowerCase()
            .includes(value.toLowerCase().trim())
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
