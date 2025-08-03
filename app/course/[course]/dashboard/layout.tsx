'use client';
import { GroupSelector } from '@components/Dashboard/GroupSelector/GroupSelector';
import { useCourse } from '@hooks/useCourse';
import { useUser } from '@hooks/useUser';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { FC, ReactNode } from 'react';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const { course } = useCourse();
  return (
    <DefaultLayout>
      <>{children}</>
      {course && user && <GroupSelector courseSpec={course.spec} />}
    </DefaultLayout>
  );
};

export default Layout;
