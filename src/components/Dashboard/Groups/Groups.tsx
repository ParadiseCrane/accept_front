import { FC, memo, useEffect, useState } from 'react';
import styles from './style.module.css';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { IGroupInvite } from '@custom-types/data/IGroup';
import Link from 'next/link';
import tableStyles from '@styles/ui/customTable.module.css';
import { Icon } from '@ui/basics';
import { Pencil, Plus, Trash } from 'tabler-icons-react';
import { ActionIcon, Divider } from '@mantine/core';

const Groups: FC<{
  spec: string;
}> = ({ spec }) => {
  const { locale } = useLocale();
  const [groups, setGroups] = useState<IGroupInvite[]>([]);
  const { data, loading } = useRequest<{}, IGroupInvite[]>(
    `invite/${spec}/all`,
    'GET',
    undefined
  );

  console.log('data', data);

  useEffect(() => {
    if (data) {
      setGroups(data);
    }
  }, [data]);

  if (!data || loading) {
    // TODO добавить loader
    return <></>;
  }

  return (
    <div className={styles.list}>
      {groups.map((group, index) => {
        return (
          <div key={group.invite}>
            <div className={styles.grid}>
              <div className={tableStyles.titleWrapper}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${group.invite}`}
                  className={tableStyles.title}
                >
                  {`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${group.invite}`}
                </Link>
              </div>
              <div>{group.group.name}</div>
              <div className={styles.buttons}>
                {/* // TODO add action for buttons */}
                <Icon
                  onClick={() => {}}
                  variant="transparent"
                  size="xs"
                  tooltipLabel={locale.ui.taskTest.edit}
                >
                  <Pencil color="var(--primary)" />
                </Icon>
                <Icon
                  onClick={() => {}}
                  color="red"
                  variant="transparent"
                  size="xs"
                >
                  <Trash />
                </Icon>
              </div>
            </div>
            {index === groups.length - 1 ? (
              <Divider my={'md'} size={0} />
            ) : (
              <Divider my={'md'} />
            )}
          </div>
        );
      })}
      {/* TODO add real action to the button */}
      <ActionIcon
        w={'100%'}
        h={'50px'}
        variant="outline"
        color="green"
        onClick={() => {}}
      >
        <Plus />
      </ActionIcon>
    </div>
  );
};

export default memo(Groups);
