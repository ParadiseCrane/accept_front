"use client";
import { FC, memo, useCallback, useEffect, useState } from "react";
import styles from "./style.module.css";
import { useLocale } from "@hooks/useLocale";
import { IGroupInvite } from "@custom-types/data/IGroup";
import { Icon, Tip } from "@ui/basics";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import { Divider, LoadingOverlay } from "@mantine/core";
import DeleteModal from "@components/Group/DeleteModal/DeleteModal";
import CopyButton from "@ui/CopyButton/CopyButton";
import { LinkCopy } from "@ui/LinkCopy/LinkCopy";
import { sendRequest } from "@requests/request";
import { useCourse } from "@hooks/useCourse";

const Groups: FC<{
  course_spec: string;
}> = ({ course_spec }) => {
  const { onGroupDelete } = useCourse();
  const { locale } = useLocale();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<IGroupInvite[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await sendRequest<{}, IGroupInvite[]>(
      `invite/${course_spec}/all`,
      "GET",
      undefined,
      true,
    );
    if (!response.error) {
      setGroups(response.response);
    }
    setLoading(false);
  }, [course_spec]);

  const onDelete = useCallback(
    async (spec: string) => {
      await fetchData();
      onGroupDelete(spec);
    },
    [fetchData, onGroupDelete],
  );

  useEffect(() => {
    fetchData();
  }, [course_spec, fetchData]);

  const regenerateLink = async (groupSpec: string) => {
    const response = await sendRequest<{}, string>(
      `invite/${course_spec}/${groupSpec}`,
      "POST",
    );
    if (!response.error) {
      return response.response;
    }
    return "";
  };

  if (loading) {
    return (
      <div style={{ position: "relative", height: "100%" }}>
        <LoadingOverlay visible={loading} loaderProps={{ radius: "lg" }} />
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {groups.length > 0 && (
        <div className={`${styles.grid} ${styles.info_row}`}>
          <div>{locale.dashboard.course.inviteLink}</div>
          <div>{locale.dashboard.course.groupName}</div>
          <div>{locale.dashboard.course.actions}</div>
        </div>
      )}
      {groups.map((group, index) => {
        return (
          <div key={group.invite_spec}>
            <div className={styles.grid}>
              <LinkCopy
                inviteSpec={group.invite_spec}
                regenerateLink={() => regenerateLink(group.group.spec)}
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
                  <IconPencil color="var(--primary)" />
                </Icon>
                <DeleteModal
                  group={{
                    name: group.group.name,
                    participants: 0,
                    readonly: group.group.readonly,
                    spec: group.group.spec,
                  }}
                  onDelete={onDelete}
                />
              </div>
            </div>
            {index === groups.length - 1 ? (
              <Divider my={"md"} size={0} />
            ) : (
              <Divider my={"md"} />
            )}
          </div>
        );
      })}
      <Tip label={locale.group.add}>
        <Icon
          href={`/group/add?course=${course_spec}`}
          w={"100%"}
          h={"50px"}
          variant="outline"
          color="green"
          size="sm"
        >
          <IconPlus />
        </Icon>
      </Tip>
    </div>
  );
};

export default memo(Groups);
