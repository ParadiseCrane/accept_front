import { FC, memo, useEffect, useState } from 'react';
import styles from './style.module.css';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { IGroupInvite } from '@custom-types/data/IGroup';
import { Icon, Tip } from '@ui/basics';
import { Pencil, Plus, Trash } from 'tabler-icons-react';
import { ActionIcon, Divider, LoadingOverlay } from '@mantine/core';
import DeleteModal from '@components/Group/DeleteModal/DeleteModal';
import CopyButton from '@ui/CopyButton/CopyButton';
import { LinkCopy } from '@ui/LinkCopy/LinkCopy';
import { sendRequest } from '@requests/request';

const Groups: FC<{
  course_spec: string;
}> = ({ course_spec }) => {
  const { locale } = useLocale();
  const [groups, setGroups] = useState<IGroupInvite[]>([]);
  const { data, loading } = useRequest<{}, IGroupInvite[]>(
    `invite/${course_spec}/all`,
    'GET',
    undefined
  );

  useEffect(() => {
    if (data) {
      setGroups(data);
    }
  }, [data]);

  const regenerateLink = async (groupSpec: string) => {
    const response = await sendRequest<{}, string>(
      `invite/${course_spec}/${groupSpec}`,
      'GET'
    );
    if (!response.error) {
      return response.response;
    }
    return '';
  };

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
              <LinkCopy
                inviteSpec={group.invite_spec}
                regenerateLink={() => regenerateLink(group.invite_spec)}
              />
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
      <Tip label={locale.group.add}>
        <Icon
          href={`/group/add?course=${course_spec}`}
          w={'100%'}
          h={'50px'}
          variant="outline"
          color="green"
          size="sm"
        >
          <Plus />
        </Icon>
      </Tip>
    </div>
  );
};

export default memo(Groups);
