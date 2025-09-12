"use client";
import { useLocale } from "@hooks/useLocale";
import { Button, Modal, Select } from "@ui/basics";
import SimpleButtonGroup from "@ui/SimpleButtonGroup/SimpleButtonGroup";
import { useCallback, useEffect, useState } from "react";

import styles from "./styles.module.css";
import { ComboboxItem } from "@mantine/core";
import { useParams } from "next/navigation";
import { sendRequest } from "@requests/request";
import { IUserDisplay } from "@custom-types/data/IUser";
import { useCourse } from "@hooks/useCourse";

export const AddModeratorModal = ({
  refetchData,
}: {
  refetchData: () => Promise<void>;
}) => {
  const [user, setUser] = useState<ComboboxItem | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [group, setGroup] = useState<ComboboxItem | null>(null);
  const [allUsers, setAllUsers] = useState<ComboboxItem[]>([]);
  const [groupsWithoutModerator, setGroupsWithoutModerator] = useState<
    ComboboxItem[]
  >([]);
  const pathParams = useParams<{ group: string }>();
  const { locale } = useLocale();
  const { groups } = useCourse();

  const onClose = () => {
    setShowModal(false);
    setUser(null);
    setGroup(null);
  };

  const fetchUsersForGroup = useCallback(async () => {
    const allUsersForGroupResponse = await sendRequest<{}, IUserDisplay[]>(
      "user/list-display",
      "GET",
    );
    if (!allUsersForGroupResponse.error) {
      setAllUsers(
        allUsersForGroupResponse.response.map<ComboboxItem>((user) => {
          return { label: user.shortName, value: user.login };
        }),
      );
      setUser(null);
    }
  }, []);

  const addModerator = useCallback(async () => {
    if (user && group && pathParams) {
      await sendRequest<{}, {}>(
        `course_moderator/${pathParams.group}/${user.value}/${group.value}`,
        "POST",
      );
    }
  }, [user, group, pathParams]);

  useEffect(() => {
    if (showModal) {
      setGroupsWithoutModerator(
        groups.map<ComboboxItem>((group) => {
          return { label: group.name, value: group.spec };
        }),
      );
      fetchUsersForGroup();
    }
  }, [showModal, , fetchUsersForGroup]);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        {locale.dashboard.course.addModerator}
      </Button>
      <Modal
        padding={"xl"}
        opened={showModal}
        onClose={onClose}
        withCloseButton={false}
      >
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
            data={
              groupsWithoutModerator.length ? groupsWithoutModerator : undefined
            }
            onChange={(_: string | null, option: ComboboxItem) => {
              setGroup(option);
            }}
          />
          <Select
            searchable={true}
            disabled={false}
            value={user ? user.value : null}
            placeholder={locale.dashboard.course.chooseModerator}
            classNames={{
              label: styles.label,
            }}
            clearable={false}
            allowDeselect={true}
            size="lg"
            data={allUsers.length ? allUsers : undefined}
            onChange={(_: string | null, option: ComboboxItem) =>
              setUser(option)
            }
          />
          <SimpleButtonGroup
            reversePositive={false}
            actionButton={{
              onClick:
                user && group
                  ? async () => {
                      await addModerator();
                      onClose();
                      refetchData();
                    }
                  : () => {},
              label: locale.add,
            }}
            cancelButton={{ onClick: onClose, label: locale.close }}
          />
        </div>
      </Modal>
    </>
  );
};
