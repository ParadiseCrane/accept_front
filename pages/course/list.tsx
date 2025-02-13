import DeleteModal from '@components/Group/DeleteModal/DeleteModal';
import { ICourseDisplay, ICourseListItem } from '@custom-types/data/ICourse';
import { IGroupDisplay } from '@custom-types/data/IGroup';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { DefaultLayout } from '@layouts/DefaultLayout';
import tableStyles from '@styles/ui/customTable.module.css';
import { Icon } from '@ui/basics';
import CourseList from '@ui/CourseList/CourseList';
import GroupList from '@ui/GroupList/GroupList';
import SingularSticky from '@ui/Sticky/SingularSticky';
import Title from '@ui/Title/Title';
import { ReactNode } from 'react';
import { Check, Pencil, Plus, X } from 'tabler-icons-react';
import Link from 'next/link';

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.course.list.name,
    key: 'name',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.name.value > b.name.value ? 1 : a.name.value == b.name.value ? 0 : -1,
    sorted: 0,
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
];

const refactorCourse = (course: ICourseListItem): any => ({
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
    display: (
      <div className={tableStyles.titleWrapper}>
        {/* <Link className={tableStyles.title} href={`/course/${course.spec}`}>
          {course.title}
        </Link> */}
        {course.author}
      </div>
    ),
  },
});

function CourseListPage() {
  const { isTeacher } = useUser();
  const { locale } = useLocale();
  return (
    <div>
      <Title title={locale.titles.course.list} />
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
    </div>
  );
}

CourseListPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CourseListPage;
