"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ICourse } from "@custom-types/data/ICourse";
import { useUser } from "./useUser";
import { sendRequest } from "@requests/request";
import { useSearchParams } from "next/navigation";
import { IGroupBaseInfo } from "@custom-types/data/IGroup";

interface CourseInfo {
  course: ICourse | null;
  refetch: () => Promise<void>;
  fetchGroups: () => Promise<void>;
  onGroupDelete: (spec: string) => void;
  isLoading: boolean;
  error: string | null;
  isModerator: boolean;
  isAuthor: boolean;
  item: string | null;
  groups: IGroupBaseInfo[] | undefined;
}

const CourseContext = createContext<CourseInfo>({
  course: null,
  refetch: () => new Promise(() => {}),
  fetchGroups: () => new Promise(() => {}),
  onGroupDelete: (spec: string) => {},
  isLoading: true,
  error: null,
  isModerator: false,
  isAuthor: false,
  item: null,
  groups: [],
});

export function CourseProvider({
  initialData,
  children,
  spec,
}: {
  initialData?: {
    course: ICourse;
    has_moderate_rights: boolean;
  };
  children: ReactNode;
  spec: string;
}) {
  let { user, isAdmin } = useUser();
  const [course, setCourse] = useState<ICourse | null>(
    initialData?.course || null,
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [isModerator, setIsModerator] = useState(
    initialData?.has_moderate_rights || false,
  );
  const [groups, setGroups] = useState<IGroupBaseInfo[] | undefined>(undefined);
  const searchParams = useSearchParams();

  const fetchData = useCallback(async () => {
    if (spec !== course?.spec) {
      try {
        setIsLoading(true);
        const [navigation, course, hasModerateRights] = await Promise.all([
          sendRequest(`course/course_navigation_tree/${spec}`, "GET"), // TODO Save navigation info as well
          sendRequest<undefined, ICourse>(`course/${spec}`, "GET"),
          sendRequest<any, boolean>("rights", "POST", {
            action: "moderate",
            entity_spec: spec,
            entity: "course",
          }),
        ]);

        if (navigation.error || course.error || hasModerateRights.error) {
          // throw Error("Failed to fetch context");
          setError("Failed to fetch context");
          // TODO use proper handling
        }
        setCourse(course.response);
        setIsModerator(hasModerateRights.response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }
  }, [spec, course?.spec]);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await sendRequest<{}, IGroupBaseInfo[]>(
        `course/groups/${spec}`,
        "GET",
      );
      if (!res.error) setGroups(res.response);
    } catch (err) {
      setGroups([]);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [spec]);

  const onGroupDelete = useCallback((spec: string) => {
    setGroups((prev) => prev?.filter((e) => e.spec !== spec));
  }, []);

  useEffect(() => {
    if (!initialData) {
      fetchData();
    }
  }, [initialData, fetchData]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const value = useMemo(
    () =>
      ({
        course,
        isLoading,
        error,
        isModerator,
        refetch: fetchData,
        isAuthor: (course && user && course.author === user.login) || isAdmin,
        item: searchParams?.get("item") || course?.spec,
        fetchGroups,
        onGroupDelete,
        groups,
      }) as CourseInfo,
    [
      course,
      error,
      fetchData,
      isLoading,
      isModerator,
      searchParams,
      user,
      groups,
      fetchGroups,
      onGroupDelete,
      isAdmin,
    ],
  );

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}

export const useCourse = () => useContext(CourseContext);
