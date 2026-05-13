"use client";

import { Icon } from "@ui/basics";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import CourseGroupSelector from "@ui/selectors/CourseGroupSelector/CourseGroupSelector";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { IGroupBaseInfo } from "@custom-types/data/IGroup";
import { useLocalStorage } from "@mantine/hooks";
import { ICourseGroupPair } from "@custom-types/data/ICourse";
import { IconArrowLeft, IconUsersGroup } from "@tabler/icons-react";

const Component: FC<{
  courseSpec: string;
  groups: IGroupBaseInfo[] | undefined;
}> = ({ courseSpec, groups }) => {
  const [showSelector, setShowSelector] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [courseGroupPairLS, setCourseGroupPairLS] = useLocalStorage<
    ICourseGroupPair[]
  >({
    key: "color-group-list",
    defaultValue: [],
  });

  const currentGroup = useMemo(() => {
    if (!groups) return null;
    const groupSpecFromUrl = searchParams?.get("group");
    return groups.find((g) => g.spec === groupSpecFromUrl) || null;
  }, [groups, searchParams]);

  const updateGroupInUrl = useCallback(
    (groupSpec: string) => {
      const params = new URLSearchParams(searchParams?.toString() || "");

      if (params.get("group") === groupSpec) return;

      params.set("group", groupSpec);

      const section = searchParams?.get("section");
      if (section) params.set("section", section);

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  useEffect(() => {
    if (groups === undefined) return;

    const groupFromUrl = searchParams?.get("group");

    if (groups.length === 0) {
      updateGroupInUrl("all");
      return;
    }

    const isUrlValid = groups.some((g) => g.spec === groupFromUrl);
    if (isUrlValid) return;

    const savedPair = courseGroupPairLS.find(
      (p) => p.courseSpec === courseSpec,
    );
    const savedGroup = savedPair
      ? groups.find((g) => g.spec === savedPair.groupSpec)
      : null;

    if (savedGroup) {
      updateGroupInUrl(savedGroup.spec);
    } else {
      updateGroupInUrl(groups[0].spec);
    }
  }, [groups, courseSpec, courseGroupPairLS, searchParams, updateGroupInUrl]);

  const handleSelectGroup = useCallback(
    (group: IGroupBaseInfo) => {
      updateGroupInUrl(group.spec);

      setCourseGroupPairLS((prev) => {
        const filtered = prev.filter((item) => item.courseSpec !== courseSpec);
        return [...filtered, { courseSpec, groupSpec: group.spec }];
      });

      setShowSelector(false);
    },
    [courseSpec, updateGroupInUrl, setCourseGroupPairLS],
  );

  return (
    <div className={`${styles.wrapper} ${showSelector ? styles.show : ""}`}>
      <div className={styles.selectorWrapper}>
        <div className={styles.selector}>
          <CourseGroupSelector
            groups={groups || []}
            currentGroup={currentGroup}
            select={handleSelectGroup}
          />
        </div>
      </div>
      <div
        className={styles.iconWrapper}
        onClick={() => setShowSelector((prev) => !prev)}
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
