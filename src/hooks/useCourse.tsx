'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ICourse } from '@custom-types/data/ICourse';
import { useUser } from './useUser';
import { sendRequest } from '@requests/request';
import { useSearchParams } from 'next/navigation';

interface CourseInfo {
  course: ICourse | null;
  refetch: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isModerator: boolean;
  isAuthor: boolean;
  item: string | null;
}

const CourseContext = createContext<CourseInfo>({
  course: null,
  refetch: () => new Promise(() => {}),
  isLoading: true,
  error: null,
  isModerator: false,
  isAuthor: false,
  item: null,
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
  let { user } = useUser();
  const [course, setCourse] = useState<ICourse | null>(
    initialData?.course || null
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [isModerator, setIsModerator] = useState(
    initialData?.has_moderate_rights || false
  );
  const searchParams = useSearchParams();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [navigation, course, hasModerateRights] = await Promise.all([
        sendRequest(`course/course_navigation_tree/${spec}`, 'GET'), // TODO Save navigation info as well
        sendRequest<undefined, ICourse>(`course/${spec}`, 'GET'),
        sendRequest<any, boolean>('rights', 'POST', {
          action: 'moderate',
          entity_spec: spec,
          entity: 'course',
        }),
      ]);

      if (navigation.error || course.error || hasModerateRights.error) {
        throw Error('Failed to fetch context');
        // TODO use proper handling
      }
      setCourse(course.response);
      setIsModerator(hasModerateRights.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [spec]);

  useEffect(() => {
    if (!initialData) {
      fetchData();
    }
  }, [fetchData, initialData]);

  const value = useMemo(
    () =>
      ({
        course,
        isLoading,
        error,
        isModerator,
        refetch: fetchData,
        isAuthor: course && user && course.author === user.login,
        item: searchParams?.get('item') || course?.spec,
      }) as CourseInfo,
    [course, error, fetchData, isLoading, isModerator, searchParams, user]
  );

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}

export const useCourse = () => useContext(CourseContext);
