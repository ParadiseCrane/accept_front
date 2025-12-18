"use client";
import {
  ICourse,
  IGroupOpenness,
  IBaseTreeUnit,
} from "@custom-types/data/ICourse";
import { sendRequest } from "@requests/request";
import { LoadingOverlay } from "@ui/basics";
import { useSearchParams } from "next/navigation";
import { FC, memo, useCallback, useEffect, useState } from "react";
import GroupOpennessTree from "./GroupOpennessTree/GroupOpennessTree";
import { useLocale } from "@hooks/useLocale";
import styles from "./styles.module.css";

const GroupOpenness: FC<{ spec: string }> = ({ spec }) => {
  const [course, setCourse] = useState<ICourse | null>(null);
  const [groupOpennessList, setGroupOpennessList] = useState<
    IGroupOpenness[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const { locale } = useLocale();

  const fetchData = useCallback(async () => {
    setLoading(true);
    if (
      searchParams &&
      searchParams.get("group") &&
      searchParams.get("group") !== "all"
    ) {
      const groupOpennessListResponse = await sendRequest<{}, IGroupOpenness[]>(
        `course/course_openness_list/${spec}/${searchParams.get("group")}`,
        "GET",
      );
      const courseNavigationTreeResponse = await sendRequest<{}, ICourse>(
        `course/course_navigation_tree/${spec}`,
        "GET",
      );
      if (
        !groupOpennessListResponse.error &&
        !courseNavigationTreeResponse.error
      ) {
        setCourse({
          ...courseNavigationTreeResponse.response,
          spec: spec,
        });
        setGroupOpennessList(groupOpennessListResponse.response);
      }
    } else if (
      searchParams &&
      searchParams.get("group") &&
      searchParams.get("group") === "all"
    ) {
      setGroupOpennessList([]);
      setCourse({
        author: "",
        children: [],
        description: "",
        image: "",
        kind: "course",
        spec,
        title: "",
        public: course?.public ?? false,
      });
    }
    setLoading(false);
  }, [spec, searchParams]);

  const toggleGroupOpennessList = useCallback(
    async (spec: string) => {
      if (!searchParams) {
        throw Error("searchParams are undefined");
      }
      // TODO: handle error
      setLoading(true);
      const response = await sendRequest<{}, IGroupOpenness[]>(
        `course/toggle_group_openness/${spec}/${searchParams?.get("group")}`,
        "PUT",
      );
      if (!response.error) {
        setGroupOpennessList(response.response);
      }
      setLoading(false);
    },
    [searchParams],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!course || !groupOpennessList || loading)
    return (
      <div style={{ position: "relative", height: "100%" }}>
        <LoadingOverlay
          visible={!course || !groupOpennessList || loading}
          loaderProps={{ radius: "lg" }}
        />
      </div>
    );

  if (
    searchParams &&
    searchParams.get("group") &&
    searchParams.get("group") === "all"
  ) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.emptyMessageWrapper}>
          <div className={styles.emptyMessage}>
            <div>{locale.dashboard.course.courseAccessChoseGroup}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GroupOpennessTree
      course={course}
      groupOpennessList={groupOpennessList}
      toggleGroupOpennessList={toggleGroupOpennessList}
    />
  );
};

export default memo(GroupOpenness);
