import { useLocale } from '@hooks/useLocale';
import { Editor } from '@tiptap/react';
import { Modal, Select } from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { useCallback, useEffect, useState } from 'react';

import styles from './styles.module.css';
import { ComboboxItem } from '@mantine/core';
import { useParams, useSearchParams } from 'next/navigation';
import { sendRequest } from '@requests/request';
import { ICourseModeratorGroup } from '@custom-types/data/ICourse';
import { IGroupBaseInfo } from '@custom-types/data/IGroup';
import { IUserDisplay } from '@custom-types/data/IUser';

export const AddModeratorModal = ({
  isOpened,
  close,
  refetchData,
}: {
  isOpened: boolean;
  close: any;
  refetchData: () => Promise<void>;
}) => {
  const [user, setUser] = useState<ComboboxItem | null>(null);
  const [group, setGroup] = useState<ComboboxItem | null>(null);
  const [allUsers, setAllUsers] = useState<ComboboxItem[]>([]);
  const [groupsWithoutModerator, setGroupsWithoutModerator] = useState<
    ComboboxItem[]
  >([]);
  const pathParams = useParams<{ spec: string }>();
  const { locale } = useLocale();

  // TODO поправить внешний вид модального окна и вызывать ререндер
  // после назначения модератора группы

  const onClose = () => {
    setUser(null);
    setGroup(null);
    setAllUsers([]);
    setGroupsWithoutModerator([]);
    close();
  };

  const fetchAllGroupsData = useCallback(async () => {
    if (pathParams && pathParams.spec) {
      const allGroupsResponse = await sendRequest<{}, IGroupBaseInfo[]>(
        `course/groups/${pathParams.spec}`,
        'GET'
      );
      const moderatorGroupsResponse = await sendRequest<
        {},
        ICourseModeratorGroup[]
      >(`course/moderator_group/${pathParams.spec}`, 'GET');
      if (!allGroupsResponse.error && !moderatorGroupsResponse.error) {
        const specs = moderatorGroupsResponse.response.map(
          (group) => group.group.spec
        );
        const filter = allGroupsResponse.response
          .filter((group) => !specs.includes(group.spec))
          .map<ComboboxItem>((group) => {
            return { label: group.name, value: group.spec };
          });
        setGroupsWithoutModerator(filter);
      }
    }
  }, [pathParams]);

  const fetchUsersForGroup = useCallback(async () => {
    if (group && pathParams) {
      const allUsersForGroupResponse = await sendRequest<{}, IUserDisplay[]>(
        `course/participant/${pathParams.spec}/${group.value}`,
        'GET'
      );
      if (!allUsersForGroupResponse.error) {
        setAllUsers(
          allUsersForGroupResponse.response.map<ComboboxItem>((user) => {
            return { label: user.shortName, value: user.login };
          })
        );
        setUser(null);
      }
    }
  }, [group]);

  const addModerator = useCallback(async () => {
    if (user && group) {
      await sendRequest<{}, {}>(
        `course_moderator/${pathParams.spec}/${user.value}/${group.value}`,
        'POST'
      );
    }
  }, [user, group]);

  useEffect(() => {
    fetchAllGroupsData();
  }, [pathParams]);

  useEffect(() => {
    fetchUsersForGroup();
  }, [group]);

  if (groupsWithoutModerator.length === 0) return null;

  return (
    <Modal opened={isOpened} onClose={close} withCloseButton={false}>
      <div className={styles.modal_body}>
        <span className={styles.title}>
          {locale.dashboard.course.addModerator}
        </span>
        <Select
          disabled={false}
          value={group ? group.value : null}
          placeholder={locale.dashboard.course.chooseGroup}
          classNames={{
            label: styles.label,
          }}
          clearable={false}
          allowDeselect={false}
          size="lg"
          data={groupsWithoutModerator}
          onChange={(value: string | null, option: ComboboxItem) => {
            setGroup(option);
            setAllUsers([]);
            setUser(null);
          }}
        />
        <Select
          disabled={false}
          value={user ? user.value : null}
          placeholder={locale.dashboard.course.chooseModerator}
          classNames={{
            label: styles.label,
          }}
          clearable={false}
          allowDeselect={true}
          size="lg"
          data={allUsers.length > 0 ? allUsers : undefined}
          onChange={(value: string | null, option: ComboboxItem) =>
            setUser(option)
          }
        />
        <SimpleButtonGroup
          reversePositive={false}
          actionButton={{
            onClick: () => {
              addModerator().then(onClose);
              refetchData();
            },
            label: locale.add,
          }}
          cancelButton={{ onClick: onClose, label: locale.close }}
        />
      </div>
    </Modal>
  );
};
