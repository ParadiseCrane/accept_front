import DeleteModal from '@components/Group/DeleteModal/DeleteModal';
import { ICourseDisplay } from '@custom-types/data/ICourse';
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
    label: locale.group.list.name,
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
];

const refactorCourse = (course: ICourseDisplay): any => ({
  name: {
    value: course.title,
    display: (
      <div className={tableStyles.titleWrapper}>
        <Link className={tableStyles.title} href={`/course/${course.spec}`}>
          {course.title}
        </Link>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 'var(--spacer-xs)',
          }}
        >
          <Icon
            color="var(--primary)"
            size="xs"
            href={`/course/edit/${course.spec}`}
          >
            <Pencil />
          </Icon>
          {/* <DeleteModal group={group} /> */}
        </div>
      </div>
    ),
  },
  readonly: {
    value: course.readonly,
    display: (
      <div>{course.readonly ? <X color="red" /> : <Check color="green" />}</div>
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
