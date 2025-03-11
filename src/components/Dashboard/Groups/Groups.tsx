import { FC, memo, useEffect, useState } from 'react';
import styles from './style.module.css';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { IGroupInvite } from '@custom-types/data/IGroup';
import { Icon } from '@ui/basics';
import { Pencil, Plus, Trash } from 'tabler-icons-react';
import { ActionIcon, Divider, LoadingOverlay } from '@mantine/core';
import DeleteModal from '@components/Group/DeleteModal/DeleteModal';
import CopyButton from '@ui/CopyButton/CopyButton';
import { LinkCopy } from '@ui/LinkCopy/LinkCopy';

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
    return (
      <div style={{ position: 'relative', height: '100%' }}>
        <LoadingOverlay visible={loading} loaderProps={{ radius: 'lg' }} />
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {groups.map((group, index) => {
        return (
          <div key={group.invite_spec}>
            <div className={styles.grid}>
              <LinkCopy inviteSpec={group.invite_spec} />
              <div>{group.group.name}</div>
              <div className={styles.buttons}>
                <CopyButton
                  toCopy={`${process.env.NEXT_PUBLIC_BASE_URL}/invite/${group.invite_spec}`}
                />
                <Icon
                  variant="transparent"
                  size="xs"
                  tooltipLabel={locale.dashboard.course.editGroup}
                  href={`/group/edit/${group.group.spec}`}
                >
                  <Pencil color="var(--primary)" />
                </Icon>
                <DeleteModal
                  group={{
                    name: group.group.name,
                    participants: 0,
                    readonly: group.group.readonly,
                    spec: group.group.spec,
                  }}
                />
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
      <ActionIcon w={'100%'} h={'50px'} variant="outline" color="green">
        <Icon href={`/group/add`} color="green" size="sm">
          <Plus />
        </Icon>
      </ActionIcon>
    </div>
  );
};

export default memo(Groups);
