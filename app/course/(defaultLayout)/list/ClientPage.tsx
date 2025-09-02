'use client';

import { ICourseListItem } from '@custom-types/data/ICourse';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import CourseList from '@ui/CourseList/CourseList';
import SingularSticky from '@ui/Sticky/SingularSticky';
import Link from 'next/link';
import { FC } from 'react';
import { Plus } from 'tabler-icons-react';
import tableStyles from '@styles/ui/customTable.module.css';

interface ClientPageProps {}
const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.course.list.lastChange,
    key: 'lastChange',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.lastChange.value > b.lastChange.value
        ? 1
        : a.lastChange.value == b.lastChange.value
          ? 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 2,
  },
  {
    label: locale.course.list.name,
    key: 'name',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.name.value > b.name.value ? 1 : a.name.value == b.name.value ? 0 : -1,
    sorted: -1,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 4,
  },
  {
    label: locale.course.list.author,
    key: 'author',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.author.value > b.author.value
        ? 1
        : a.author.value == b.author.value
          ? 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 2,
  },
  {
    label: locale.course.list.numOfModules,
    key: 'numOfModules',
    sortable: false,
    sortFunction: (a: any, b: any) =>
      a.numOfModules.value > b.numOfModules.value
        ? 1
        : a.numOfModules.value == b.numOfModules.value
          ? 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 2,
  },
];

const refactorCourse = (course: ICourseListItem): any => ({
  lastChange: {
    value: course.last_update,
    display: (
      <div className={tableStyles.titleWrapper}>{course.dateFormatted}</div>
    ),
  },
  name: {
    value: course.title,
    display: (
      <div className={tableStyles.titleWrapper}>
        <Link className={tableStyles.title} href={`/course/${course.spec}`}>
          {course.title}
        </Link>
      </div>
    ),
  },
  author: {
    value: course.author,
    display: <div className={tableStyles.titleWrapper}>{course.author}</div>,
  },
  numOfModules: {
    value: course.author,
    display: <div className={tableStyles.titleWrapper}>{course.amount}</div>,
  },
});

const ClientPage: FC<ClientPageProps> = () => {
  const { isTeacher } = useUser();
  const { locale } = useLocale();
  return (
    <>
      <CourseList
        url={'/course'}
        refactorCourse={refactorCourse}
        initialColumns={initialColumns}
      />
      {isTeacher && (
        <SingularSticky
          color="var(--positive)"
          href={`/course/add`}
          icon={<Plus height={25} width={25} />}
          description={locale.tip.sticky.course.add}
        />
      )}
    </>
  );
};

export default ClientPage;
