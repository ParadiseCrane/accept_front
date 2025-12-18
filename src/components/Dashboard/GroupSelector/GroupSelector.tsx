"use client";

import { Icon } from "@ui/basics";
import { FC, memo, useEffect, useState } from "react";

import styles from "./styles.module.css";
import CourseGroupSelector from "@ui/selectors/CourseGroupSelector/CourseGroupSelector";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { IGroupBaseInfo } from "@custom-types/data/IGroup";
import { useLocalStorage } from "@mantine/hooks";
import { ICourseGroupPair } from "@custom-types/data/ICourse";
import { IconArrowLeft, IconUsersGroup } from "@tabler/icons-react";

const Component: FC<{
  courseSpec: string;
  groups: IGroupBaseInfo[];
}> = ({ courseSpec, groups = [] }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<IGroupBaseInfo | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [courseGroupPairLS, setCourseGroupPairLS] = useLocalStorage<
    ICourseGroupPair[]
  >({
    key: "color-group-list",
    defaultValue: [],
  });

  const changeUrl = (groupSpec: string) => {
    if (searchParams) {
      const section = searchParams.get("section");
      if (section) {
        changeParams(section, groupSpec);
      }
    }
  };

  const setGroup = (group: IGroupBaseInfo) => {
    setCurrentGroup(group);
    changeUrl(group.spec);
    setCourseGroupPairLS((prev) => [
      ...prev,
      { courseSpec, groupSpec: group.spec },
    ]);
  };

  useEffect(() => {
    if (searchParams) {
      if (groups.length === 0) {
        changeUrl("all");
        setCurrentGroup(null);
      } else {
        const hasGroupUrl =
          searchParams.has("group") && searchParams.get("group") !== "all";
        if (hasGroupUrl) {
          const group = groups.find(
            (item) => item.spec === searchParams.get("group")
          );
          if (group) {
            setGroup(group);
          } else {
            setGroup(groups[0]);
          }
        } else {
          const courseGroupPair = courseGroupPairLS
            .filter((item) => item.courseSpec === courseSpec)
            .pop();
          if (courseGroupPair) {
            const matchedGroup = groups.find(
              (item) => item.spec === courseGroupPair.groupSpec
            );
            setGroup(matchedGroup ?? groups[0]);
          } else {
            setGroup(groups[0]);
          }
        }
      }
    }
  }, [groups, searchParams]);

  const changeParams = (section: string, group: string) => {
    if (searchParams) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("section", section);
      params.set("group", group);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className={styles.wrapper + " " + (showSelector ? styles.show : "")}>
      <div className={styles.selectorWrapper}>
        <div className={styles.selector}>
          <CourseGroupSelector
            groups={groups}
            currentGroup={currentGroup}
            select={(item: IGroupBaseInfo) => {
              setGroup(item);
            }}
          />
        </div>
      </div>
      <div
        className={styles.iconWrapper}
        onClick={() => {
          setShowSelector((value) => !value);
        }}
      >
        <Icon size="sm" className={styles.iconRoot}>
          {showSelector ? (
            <IconArrowLeft color="var(--primary)" />
          ) : (
            <IconUsersGroup color="var(--primary)" />
          )}
        </Icon>
      </div>
    </div>
  );
};

export const GroupSelector = memo(Component);
